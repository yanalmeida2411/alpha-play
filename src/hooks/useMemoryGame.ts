"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { saveMemoryGameResult } from "@/src/actions/memoryGameAction";
import { Card, GameLevel } from "@/src/types/memory-game";
import { ALPHABET, CARD_COLORS } from "@/src/lib/constants/memory-game";

export function useMemoryGame(childId: string) {
  const [level, setLevel] = useState<GameLevel>(1);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [wrongMatches, setWrongMatches] = useState(0);
  const [_correctMatches, setCorrectMatches] = useState(0);
  const [accumulatedWrongMatches, setAccumulatedWrongMatches] = useState(0);
  const [accumulatedCorrectMatches, setAccumulatedCorrectMatches] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [_timeToStart, setTimeToStart] = useState("");
  const [timeToStartTotal, setTimeToStartTotal] = useState("");
  const [isProcessing, setIsProcessing] = useState(true);
  const [wrongPair, setWrongPair] = useState<number[]>([]);
  const [hasSentResult, setHasSentResult] = useState(false);
  const [earnedStars, setEarnedStars] = useState<number | undefined>(undefined);
  const isSavingRef = useRef(false);

  const getPairsCount = useCallback((lvl: GameLevel) => {
    if (lvl === 1) return 3;
    if (lvl === 2) return 4;
    return 5;
  }, []);

  const saveFinalResult = useCallback(
    async (finalWrong: number, finalCorrect: number) => {
      if (hasSentResult || isSavingRef.current) return;
      isSavingRef.current = true;

      const timeToFinish = new Date().toISOString();

      const response = await saveMemoryGameResult({
        childId,
        timeToStart: timeToStartTotal || new Date().toISOString(),
        timeToFinish,
        wrongMatches: finalWrong,
        correctMatches: finalCorrect,
      });

      if (response.success && response.data) {
        setEarnedStars(response.data.earnedStars);
      }

      setHasSentResult(true);
      isSavingRef.current = false;
    },
    [childId, timeToStartTotal, hasSentResult],
  );

  const handleLevelComplete = useCallback(
    async (currentLevel: GameLevel, currentWrong: number) => {
      const correct = getPairsCount(currentLevel);
      const newTotalWrong = accumulatedWrongMatches + currentWrong;
      const newTotalCorrect = accumulatedCorrectMatches + correct;

      setAccumulatedWrongMatches(newTotalWrong);
      setAccumulatedCorrectMatches(newTotalCorrect);

      if (currentLevel === 3) {
        await saveFinalResult(newTotalWrong, newTotalCorrect);
      }

      setShowModal(true);
    },
    [
      getPairsCount,
      accumulatedWrongMatches,
      accumulatedCorrectMatches,
      saveFinalResult,
    ],
  );

  const initGame = useCallback(
    (lvl: GameLevel) => {
      const pairsCount = getPairsCount(lvl);
      const shuffledAlphabet = [...ALPHABET].sort(() => Math.random() - 0.5);
      const selectedLetters = shuffledAlphabet.slice(0, pairsCount);
      const gameCards: Card[] = [];

      if (lvl === 1) {
        setAccumulatedWrongMatches(0);
        setAccumulatedCorrectMatches(0);
        setHasSentResult(false);
        setEarnedStars(undefined);
        isSavingRef.current = false;
      }

      selectedLetters.forEach((letter, index) => {
        const color = CARD_COLORS[index % CARD_COLORS.length] || "#0C78F4";
        const pair = [
          {
            id: `${letter}-1`,
            letter: letter,
            color: color,
            isFlipped: true,
            isMatched: false,
          },
          {
            id: `${letter}-2`,
            letter: letter,
            color: color,
            isFlipped: true,
            isMatched: false,
          },
        ];
        gameCards.push(...(pair as Card[]));
      });

      for (let i = gameCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = gameCards[i];
        if (temp && gameCards[j]) {
          gameCards[i] = gameCards[j] as Card;
          gameCards[j] = temp;
        }
      }

      for (let i = 0; i < gameCards.length - 1; i++) {
        const current = gameCards[i];
        const next = gameCards[i + 1];
        if (current && next && current.letter === next.letter) {
          const target = (i + 2) % gameCards.length;
          const temp = gameCards[i + 1];
          if (temp && gameCards[target]) {
            gameCards[i + 1] = gameCards[target] as Card;
            gameCards[target] = temp;
          }
        }
      }

      setCards(gameCards);
      setFlippedCards([]);
      setWrongMatches(0);
      setCorrectMatches(0);
      setIsProcessing(true);
      setWrongPair([]);
      setShowModal(false);

      setTimeout(() => {
        setCards((prev) => prev.map((card) => ({ ...card, isFlipped: false })));
        setIsProcessing(false);
        const now = new Date().toISOString();
        setTimeToStart(now);
        if (lvl === 1) {
          setTimeToStartTotal(now);
        }
      }, 3000);
    },
    [getPairsCount],
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      initGame(level);
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [level, initGame]);

  const handleCardClick = (index: number) => {
    const card = cards[index];
    if (
      !card ||
      isProcessing ||
      card.isFlipped ||
      card.isMatched ||
      flippedCards.length === 2
    )
      return;

    const newCards = [...cards];
    const targetCard = newCards[index];
    if (targetCard) {
      targetCard.isFlipped = true;
      setCards(newCards);
    }

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setIsProcessing(true);
      const firstIdx = newFlipped[0];
      const secondIdx = newFlipped[1];

      if (firstIdx !== undefined && secondIdx !== undefined) {
        const card1 = cards[firstIdx];
        const card2 = cards[secondIdx];

        if (card1 && card2 && card1.letter === card2.letter) {
          setTimeout(() => {
            setCards((prev) => {
              const updated = [...prev];
              const c1 = updated[firstIdx];
              const c2 = updated[secondIdx];
              if (c1) c1.isMatched = true;
              if (c2) c2.isMatched = true;
              return updated;
            });
            setFlippedCards([]);

            setCorrectMatches((prevCount) => {
              const newCount = prevCount + 1;
              const totalPairs = getPairsCount(level);

              if (newCount === totalPairs) {
                setTimeout(() => {
                  handleLevelComplete(level, wrongMatches);
                }, 0);
              }
              return newCount;
            });
            setIsProcessing(false);
          }, 600);
        } else {
          setTimeout(() => {
            setWrongPair([firstIdx, secondIdx]);

            setTimeout(() => {
              setCards((prev) => {
                const updated = [...prev];
                const c1 = updated[firstIdx];
                const c2 = updated[secondIdx];
                if (c1) c1.isFlipped = false;
                if (c2) c2.isFlipped = false;
                return updated;
              });
              setFlippedCards([]);
              setWrongPair([]);
              setWrongMatches((prev) => prev + 1);
              setIsProcessing(false);
            }, 800);
          }, 600);
        }
      }
    }
  };

  const handleNextLevel = () => {
    if (level < 3) {
      setLevel((prev) => (prev + 1) as GameLevel);
    } else {
      setLevel(1);
      setTimeout(() => initGame(1), 0);
    }
  };

  const handleExit = useCallback(async () => {
    await saveFinalResult(accumulatedWrongMatches, accumulatedCorrectMatches);
  }, [saveFinalResult, accumulatedWrongMatches, accumulatedCorrectMatches]);

  return {
    level,
    cards,
    showModal,
    wrongPair,
    handleCardClick,
    handleNextLevel,
    getPairsCount,
    initGame,
    handleExit,
    earnedStars,
  };
}
