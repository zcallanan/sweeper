import React from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFlag,
  faQuestionCircle,
  faBomb,
  faFireAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFlag as farFlag,
  faQuestionCircle as farQuestionCircle,
} from "@fortawesome/free-regular-svg-icons";
import {
  GameStateType,
  AnimationsType,
  ModesType,
  SquareDataType,
  ExplosionType,
  DictBool,
} from "../types";

interface Props {
  animations: AnimationsType;
  gameState: GameStateType;
  modes: ModesType;
  squareData: SquareDataType;
  squareKey: string;
  explode: (squareKey: string) => void;
  onSquareClick: (squareKey: string) => void;
  toggleScroll: (bool: boolean, anim: string) => void;
  explosion: ExplosionType;
}

type SquareProps = {
  bombAnimIsPlaying: boolean;
  fireAnimIsPlaying: boolean;
};

type SquareAction = { type: "AllValues"; payload: SquareProps }
  | { type: "SetBombAnim"; payload: DictBool }
  | { type: "SetFireAnim"; payload: DictBool };

const Square = ({
  animations,
  gameState,
  modes,
  squareData,
  squareKey,
  explode,
  onSquareClick,
  toggleScroll,
  explosion
}): JSX.Element => {
  // Reducer
  const squareReducer = (state: typeof initialVals, action: SquareAction) => {
    switch (action.type) {
      case "AllValues":
        return {
          bombAnimIsPlaying: action.payload.bombAnimIsPlaying,
          fireAnimIsPlaying: action.payload.fireAnimIsPlaying,
        };
      case "SetBombAnim":
      return {
        ...state,
        size: action.payload.bombAnimIsPlaying,
      };
      case "SetFireAnim":
      return {
        ...state,
        bombs: action.payload.fireAnimIsPlaying,
      };
      default:
        throw new Error();
    }
  };

  const initialVals: SquareProps = {
    bombAnimIsPlaying: false,
    fireAnimIsPlaying: false,
  }

  // Manage state
  const [squareState, squareDispatch] = React.useReducer(
    squareReducer,
    initialVals,
  );

  React.useEffect(() => {
    // From State
    const bombState: boolean = squareState.bombAnimIsPlaying;
    const fireState: boolean = squareState.fireAnimIsPlaying;
    // From Props
    const explodeTrigger: boolean = explosion.explodeTrigger;
    const fire: boolean = explosion.explodeFire;
    // Reset square if it's a new game
    if (modes.newGame && fireState) {
      squareDispatch({
        type: "SetFireAnim",
        payload: {
          fireAnimIsPlaying: false,
        },
      });
    } else if (modes.newGame && bombState) {
      squareDispatch({
        type: "SetBombAnim",
        payload: {
          bombAnimIsPlaying: false,
        },
      });
    }
    // Prevent animation renders if an animation is already playing
    if (explodeTrigger && !fire && !bombState) {
      squareDispatch({
        type: "AllValues",
        payload: {
          bombAnimIsPlaying: true,
          fireAnimIsPlaying: false,
        },
      });
    } else if (!explodeTrigger && fire && !fireState) {
      squareDispatch({
        type: "AllValues",
        payload: {
          bombAnimIsPlaying: false,
          fireAnimIsPlaying: true,
        },
      });
    }
  });

  const cssTransition = (): JSX.Element => {
    // From State
    const bombState: boolean = squareState.bombAnimIsPlaying;
    const fireState: boolean = squareState.fireAnimIsPlaying;
    // From Props
    const bombFade: boolean = animations.bombFade;
    const explodeTrigger: boolean = explosion.explodeTrigger;
    const fire: boolean = explosion.explodeFire;

    if (explodeTrigger && !fire && !bombState) {
      return (
        <CSSTransition
          classNames="bomba"
          key={squareKey}
          in={explodeTrigger}
          appear={explodeTrigger}
          onEnter={() => explode(squareKey)}
          timeout={{ enter: 1000, exit: 1000 }}
        >
          <FontAwesomeIcon key={squareKey} icon={faBomb} />
        </CSSTransition>
      );
    } else if (!explodeTrigger && fire && !fireState) {
      return (
        <CSSTransition
          className="fire-enter"
          classNames="fire"
          mountOnEnter
          key={squareKey}
          in={fire}
          appear={fire}
          timeout={{ enter: 10000, exit: 20000 }}
        >
          <FontAwesomeIcon key={squareKey} icon={faFireAlt} />
        </CSSTransition>
      );
    } else if (gameState.progress === 1) {
      // On win, change bomb opacity
      return (
        <CSSTransition
          classNames="win"
          mountOnEnter
          key={squareKey}
          in={bombFade}
          appear={bombFade}
          timeout={{ enter: 3000, exit: 3000 }}
        >
          <FontAwesomeIcon key={squareKey} icon={faBomb} />
        </CSSTransition>
      );
    }
  };

  const renderIcons = (): JSX.Element => {
    // From Props
    const bomb: boolean = squareData.bomb;
    const clicked: boolean = squareData.clicked;
    const flaggedBool: boolean = squareData.flagged;
    const questionmarkBool: boolean = squareData.questionMarked;

    if (bomb && clicked) {
      // If it's a bomb and clicked, show the bomb
      return (
        <TransitionGroup component="span" className="bomba">
          {cssTransition()}
        </TransitionGroup>
      );
    } else if (flaggedBool && !clicked) {
      return (
        <span>
          <FontAwesomeIcon icon={faFlag} />
        </span>
      );
    } else if (questionmarkBool && !clicked) {
      return (
        <span>
          <FontAwesomeIcon icon={faQuestionCircle} />
        </span>
      );
    }
    if (gameState.progress === 0) {
      return (
        <span>
          <FontAwesomeIcon className="flag-icon" icon={farFlag} />
          <FontAwesomeIcon
            className="questionmark-icon"
            icon={farQuestionCircle}
          />
        </span>
      );
    }
  };

  const disableButtons = (attribute: object): object => {
    if (modes.bombMode || modes.drawing) {
      attribute["disabled"] = "disabled";
    }
    return attribute;
  };

  const insertElement = (element: boolean): JSX.Element => {
    if (element) {
      const adjacentBombCount: number = squareData.adjacentBombCount;
      return (
        <p className={`bomb-count neighbors-${adjacentBombCount}`}>
          {adjacentBombCount}
        </p>
      );
    }
  };

  const buttonMarkup = (
    className: string,
    attribute: object,
    element: boolean
  ): JSX.Element => {

    return (
      <button
        className={className}
        {...attribute}
        onClick={() => {
          onSquareClick(squareKey);
        }}
      >
        <span>
          {insertElement(element)}
          {renderIcons()}
        </span>
      </button>
    );
  };

  // Handles button modes
  const generateButton = (): JSX.Element => {
    // From Props
    const clicked: boolean = squareData.clicked;
    const hint: boolean = squareData.hint;
    const flaggedBool: boolean = squareData.flagged;
    const questionmarkBool: boolean = squareData.questionMarked;
    const drawingBool: boolean = modes.drawing;

    let className: string = "";
    let attribute: object = {};
    let element: boolean = false;

    if (clicked) {
      // Disable the button if it's been clicked
      className = "square";
      attribute["disabled"] = "disabled";
      return buttonMarkup(className, attribute, element);
    } else if (modes.flagMode) {
      // Toggle placement of flags
      if (questionmarkBool) {
        className = "square flag-mode questionmarked";
      } else if (flaggedBool) {
        // In flagMode, if the square is flagged, show a solid flag
        className = "square flag-mode flagged";
      } else if (hint) {
        if (questionmarkBool) {
          // In flagMode, if the square has a solid question mark over a hint, display it (hint should be hidden)
          className = "square flag-mode questionmarked hint";
        } else {
          // Toggle display of hints if hint is true and it doesn't have a flag or question mark
          element = true;
          className = "square flag-mode hint";
        }
        return buttonMarkup(className, attribute, element);
      } else {
        className = "square flag-mode";
      }
    } else if (modes.questionMode) {
      // Toggle question marks
      if (flaggedBool) {
        // In questionMode, if the square is flagged
        className = "square questionmark-mode flagged";
      } else if (questionmarkBool) {
        className = "square questionmark-mode questionmarked";
      } else if (hint) {
        if (flaggedBool) {
          // In questionMode, if the square has a solid flag over a hint, display it
          className = "square questionmark-mode flagged hint";
        } else {
          // Toggle display of hints if hint is true and it doesn't have a flag or question mark
          element = true;
          className = "square questionmark-mode hint";
        }
        return buttonMarkup(className, attribute, element);
      } else {
        className = "square questionmark-mode";
      }
    } else if (hint) {
      if (flaggedBool) {
        // If a square eligible to display a hint is flagged, display the flag
        className = !modes.bombMode
          ? "square flagged hint"
          : "square flagged hint bomb-mode";
      } else if (questionmarkBool) {
        // If a square eligible to display a hint is question marked, display the question mark
        className = !modes.bombMode
          ? "square questionmarked hint"
          : "square questionmarked hint bomb-mode";
      } else {
        // Toggle display of hints
        element = true;
        className = !modes.bombMode ? "square hint" : "square hint bomb-mode";
      }
      attribute = disableButtons(attribute);
      return buttonMarkup(className, attribute, element);
    } else {
      attribute = disableButtons(attribute);
      if (flaggedBool) {
        // if a square is clickable or a bomb is active, display the flag on the square
        className = !modes.bombMode
          ? "square flagged"
          : "square flagged bomb-mode";
      } else if (questionmarkBool) {
        // if a square is clickable or a bomb is active, display the question mark on the square
        className = !modes.bombMode
          ? "square questionmarked"
          : "square questionmarked bomb-mode";
      } else {
        if (drawingBool) {
          // If the board is drawing, disable the buttons
          className = "drawing default";
          attribute = disableButtons(attribute);
        } else {
          // Default functional button
          className = !modes.bombMode
            ? "square default"
            : "square default bomb-mode";
        }
      }
    }
    return buttonMarkup(className, attribute, element);
  };

  let squareScroll = modes.newGame && !animations.squareScroll
    ? true
    : false;

  return (
    <TransitionGroup
      component="div"
      className="squares"
      key={`${squareKey}-${animations.seed}`}
    >
      <CSSTransition
        classNames="squares"
        in={squareScroll}
        appear={squareScroll}
        key={`${squareKey}-${animations.seed}`}
        onEnter={() => toggleScroll(false, "squareScroll")}
        timeout={{ enter: 1500 }}
      >
        {generateButton()}
      </CSSTransition>
    </TransitionGroup>
  );
}

export default Square;
