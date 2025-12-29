import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import type { CharacterAlignmentResponseModel } from "@elevenlabs/elevenlabs-js/api/types/CharacterAlignmentResponseModel";

export type TranscriptWord = {
  kind: "word";
  text: string;
  startTime: number;
  endTime: number;
  segmentIndex: number;
};

export type TranscriptGap = {
  kind: "gap";
  text: string;
  segmentIndex: number;
};

export type TranscriptSegment = TranscriptWord | TranscriptGap;

export type SegmentComposer = (
  alignment: CharacterAlignmentResponseModel,
) => TranscriptSegment[];

export type UseTranscriptViewerResult = {
  audioRef: RefObject<HTMLAudioElement | null>;
  segments: TranscriptSegment[];
  spokenSegments: TranscriptSegment[];
  unspokenSegments: TranscriptSegment[];
  currentWord: TranscriptWord | null;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
  seekToTime: (time: number) => void;
  startScrubbing: () => void;
  endScrubbing: () => void;
};

type UseTranscriptViewerOptions = {
  alignment: CharacterAlignmentResponseModel;
  hideAudioTags?: boolean;
  segmentComposer?: SegmentComposer;
  onPlay?: () => void;
  onPause?: () => void;
  onTimeUpdate?: (time: number) => void;
  onEnded?: () => void;
  onDurationChange?: (duration: number) => void;
};

function defaultSegmentComposer(
  alignment: CharacterAlignmentResponseModel,
  hideAudioTags: boolean,
): TranscriptSegment[] {
  const segments: TranscriptSegment[] = [];
  const { characters, characterStartTimesSeconds, characterEndTimesSeconds } =
    alignment;

  if (!characters || !characterStartTimesSeconds || !characterEndTimesSeconds) {
    return segments;
  }

  let currentWord = "";
  let wordStartTime: number | null = null;
  let wordEndTime: number | null = null;
  let segmentIndex = 0;
  let inTag = false;
  let tagContent = "";

  for (let i = 0; i < characters.length; i++) {
    const char = characters[i];
    const startTime = characterStartTimesSeconds[i];
    const endTime = characterEndTimesSeconds[i];

    if (hideAudioTags) {
      if (char === "<") {
        inTag = true;
        tagContent = "<";
        continue;
      }
      if (inTag) {
        tagContent += char;
        if (char === ">") {
          inTag = false;
          tagContent = "";
        }
        continue;
      }
    }

    if (char === " " || char === "\n" || char === "\t") {
      if (currentWord && wordStartTime !== null && wordEndTime !== null) {
        segments.push({
          kind: "word",
          text: currentWord,
          startTime: wordStartTime,
          endTime: wordEndTime,
          segmentIndex: segmentIndex++,
        });
        currentWord = "";
        wordStartTime = null;
        wordEndTime = null;
      }
      segments.push({
        kind: "gap",
        text: char,
        segmentIndex: segmentIndex++,
      });
    } else {
      if (wordStartTime === null) {
        wordStartTime = startTime;
      }
      wordEndTime = endTime;
      currentWord += char;
    }
  }

  if (currentWord && wordStartTime !== null && wordEndTime !== null) {
    segments.push({
      kind: "word",
      text: currentWord,
      startTime: wordStartTime,
      endTime: wordEndTime,
      segmentIndex: segmentIndex++,
    });
  }

  return segments;
}

export function useTranscriptViewer({
  alignment,
  hideAudioTags = true,
  segmentComposer,
  onPlay,
  onPause,
  onTimeUpdate,
  onEnded,
  onDurationChange,
}: UseTranscriptViewerOptions): UseTranscriptViewerResult {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [_isScrubbing, setIsScrubbing] = useState(false);
  const wasPlayingBeforeScrub = useRef(false);

  const segments = useMemo(() => {
    if (segmentComposer) {
      return segmentComposer(alignment);
    }
    return defaultSegmentComposer(alignment, hideAudioTags);
  }, [alignment, hideAudioTags, segmentComposer]);

  const words = useMemo(
    () => segments.filter((s): s is TranscriptWord => s.kind === "word"),
    [segments],
  );

  const currentWord = useMemo(() => {
    for (const word of words) {
      if (currentTime >= word.startTime && currentTime < word.endTime) {
        return word;
      }
    }
    return null;
  }, [words, currentTime]);

  const { spokenSegments, unspokenSegments } = useMemo(() => {
    const spoken: TranscriptSegment[] = [];
    const unspoken: TranscriptSegment[] = [];

    let foundCurrent = false;
    for (const segment of segments) {
      if (segment.kind === "word") {
        if (segment === currentWord) {
          foundCurrent = true;
          continue;
        }
        if (!foundCurrent && currentTime >= segment.endTime) {
          spoken.push(segment);
        } else if (foundCurrent || currentTime < segment.startTime) {
          unspoken.push(segment);
        }
      } else {
        if (foundCurrent) {
          unspoken.push(segment);
        } else {
          const nextWord = words.find(
            (w) => w.segmentIndex > segment.segmentIndex,
          );
          if (nextWord && currentTime >= nextWord.startTime) {
            spoken.push(segment);
          } else if (currentWord) {
            const prevWord = words
              .slice()
              .reverse()
              .find((w) => w.segmentIndex < segment.segmentIndex);
            if (prevWord && prevWord === currentWord) {
              unspoken.push(segment);
            } else if (prevWord && currentTime >= prevWord.endTime) {
              spoken.push(segment);
            } else {
              unspoken.push(segment);
            }
          } else {
            const prevWord = words
              .slice()
              .reverse()
              .find((w) => w.segmentIndex < segment.segmentIndex);
            if (prevWord && currentTime >= prevWord.endTime) {
              spoken.push(segment);
            } else {
              unspoken.push(segment);
            }
          }
        }
      }
    }

    return { spokenSegments: spoken, unspokenSegments: unspoken };
  }, [segments, currentWord, currentTime, words]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const time = audio.currentTime;
      setCurrentTime(time);
      onTimeUpdate?.(time);
    };

    const handleDurationChange = () => {
      const dur = audio.duration;
      if (!isNaN(dur)) {
        setDuration(dur);
        onDurationChange?.(dur);
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
      onPlay?.();
    };

    const handlePause = () => {
      setIsPlaying(false);
      onPause?.();
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("loadedmetadata", handleDurationChange);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("loadedmetadata", handleDurationChange);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [onPlay, onPause, onTimeUpdate, onEnded, onDurationChange]);

  const play = useCallback(() => {
    audioRef.current?.play();
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const seekToTime = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const startScrubbing = useCallback(() => {
    setIsScrubbing(true);
    wasPlayingBeforeScrub.current = isPlaying;
    if (isPlaying) {
      audioRef.current?.pause();
    }
  }, [isPlaying]);

  const endScrubbing = useCallback(() => {
    setIsScrubbing(false);
    if (wasPlayingBeforeScrub.current) {
      audioRef.current?.play();
    }
  }, []);

  return {
    audioRef,
    segments,
    spokenSegments,
    unspokenSegments,
    currentWord,
    currentTime,
    duration,
    isPlaying,
    play,
    pause,
    seekToTime,
    startScrubbing,
    endScrubbing,
  };
}
