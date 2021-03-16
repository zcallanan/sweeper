import React from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { statsReducer, statsInit } from "../reducers";
import { StatsProps } from "../types";

const Stats = ({ stats, options, revealTarget }: StatsProps): JSX.Element => {
  // Manage state
  const [statsState, statsDispatch] = React.useReducer(
    statsReducer,
    statsInit,
  );

  React.useEffect(() => {
    // From State
    const sizeState: number = statsState.size;
    const bombsState: number = statsState.bombs;
    const totalToRevealState: number = statsState.totalToReveal;
    // From Props
    let sizeProps: number;
    if (typeof options.size === "number") {
      sizeProps = options.size;
    }
    const bombsProps: number = stats.bombs;

    const currentTotalToReveal: number = sizeProps ** 2 - bombsProps;

    if (bombsProps > 0 && sizeProps > 0 && totalToRevealState < 0) {
      // Save initial values to state
      statsDispatch({
        type: "STATS_INIT_VALUES",
        payload: {
          bombs: bombsProps,
          size: sizeProps,
          totalToReveal: currentTotalToReveal,
        },
      });
    } else if (
      // TotatToReveal changed, save it
      bombsProps > 0
      && sizeProps > 0
      && totalToRevealState > 0
      && totalToRevealState !== currentTotalToReveal
      && sizeProps === sizeState
      && bombsProps !== bombsState
    ) {
      statsDispatch({
        type: "STATS_SET_TOTALTOREVEAL",
        payload: {
          totalToReveal: currentTotalToReveal,
        },
      });
    }
    if (
      (sizeState < 0 || sizeState !== sizeProps)
      && sizeProps > 0
    ) {
      // Size changed, save it
      statsDispatch({
        type: "STATS_SET_SIZE",
        payload: {
          size: sizeProps,
        },
      });
    }
    if ((bombsState < 0 || bombsState !== bombsProps) && bombsProps > 0) {
      // Bombs changed, save it
      statsDispatch({
        type: "STATS_SET_BOMBS",
        payload: {
          bombs: bombsProps,
        },
      });
    }
    revealTarget(totalToRevealState);
  }, [stats,
    options,
    revealTarget,
    statsState.bombs,
    statsState.size,
    statsState.totalToReveal,
  ]);

  const renderLives = (): React.ReactNode => {
    const statsProps = stats;
    const currentLives = statsProps.currentLives;
    let life = "Lives:";
    if (currentLives === 1) {
      life = "Life:";
    }
    // Avoid display of stats before currentLives is set
    if (currentLives >= 0) {
      return (
        <tr key="lifeCount">
          <td>{life}</td>
          <td>
            <TransitionGroup component="span" className="lives">
              <CSSTransition
                classNames="lives"
                key={currentLives}
                timeout={{ enter: 3000, exit: 3000 }}
              >
                <span>{currentLives}</span>
              </CSSTransition>
            </TransitionGroup>
          </td>
        </tr>
      );
    }
  };

  const renderBombCount = (): React.ReactNode => {
    const bombs = stats.bombs;
    if (bombs >= 0) {
      return (
        <tr key="bombs">
          <td>Hidden Bombs:</td>
          <td>
            <TransitionGroup component="span" className="bombs">
              <CSSTransition
                classNames="bombs"
                key={bombs}
                timeout={{ enter: 1500, exit: 1500 }}
              >
                <span>{bombs}</span>
              </CSSTransition>
            </TransitionGroup>
          </td>
        </tr>
      );
    }
  };

  const renderRevealed = (): React.ReactNode => {
    const revealed = stats.revealed;
    const totalToReveal = statsState.totalToReveal;

    if (revealed >= 0 && totalToReveal >= 0) {
      return (
        <tr key="revealed">
          <td>Squares Revealed: </td>
          <td>
            <TransitionGroup component="span" className="revealed">
              <CSSTransition
                classNames="revealed"
                key={revealed}
                timeout={{ enter: 1500, exit: 1500 }}
              >
                <span>{revealed}</span>
              </CSSTransition>
            </TransitionGroup>
          </td>
          <td>/</td>
          <td>
            <TransitionGroup component="span" className="total-to-reveal">
              <CSSTransition
                classNames="total-to-reveal"
                key={totalToReveal}
                timeout={{ enter: 1500, exit: 1500 }}
              >
                <span>{totalToReveal}</span>
              </CSSTransition>
            </TransitionGroup>
          </td>
        </tr>
      );
    }
  };

  const renderFlagCount = (): React.ReactNode => {
    const flags = stats.flags;
    let flagText = "Bombs Flagged:";
    if (flags === 1) {
      flagText = "Bomb Flagged:";
    }
    if (flags >= 0) {
      return (
        <tr key="flags">
          <td>{flagText}</td>
          <td>
            <TransitionGroup component="span" className="flags">
              <CSSTransition
                classNames="flags"
                key={flags}
                timeout={{ enter: 1500, exit: 1500 }}
              >
                <span>{flags}</span>
              </CSSTransition>
            </TransitionGroup>
          </td>
        </tr>
      );
    }
  };

  const renderQuestionsCount = (): React.ReactNode => {
    const questions = stats.questions;
    if (questions >= 0) {
      return (
        <tr key="questions">
          <td>Marked Unknown:</td>
          <td>
            <TransitionGroup component="span" className="questions">
              <CSSTransition
                classNames="questions"
                key={questions}
                timeout={{ enter: 1500, exit: 1500 }}
              >
                <span>{questions}</span>
              </CSSTransition>
            </TransitionGroup>
          </td>
        </tr>
      );
    }
  };

  return (
    <div className="stats-wrapper">
      <h3 className="stats-title">Stats</h3>
      <table>
        <tbody>
          {renderLives()}
          {renderBombCount()}
          {renderRevealed()}
          {renderFlagCount()}
          {renderQuestionsCount()}
        </tbody>
      </table>
    </div>
  );
}

export default Stats;
