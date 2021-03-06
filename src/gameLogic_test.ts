describe("In Mahjong", function() {
  let OK = true;
  let ILLEGAL = false;
  let X_ZHUA_TURN = 0;
  let X_DA_TURN = 0;
  let O_ZHUA_TURN = 1;
  let O_DA_TURN = 1;
  let NO_ONE_TURN = -1;
  let NO_ONE_WINS: number[] = null;
  let X_WIN_SCORES = [1, 0];
  let O_WIN_SCORES = [0, 1];
  let TIE_SCORES = [0, 0];
  let INITIAL_BOARD : Board = {
    stock:[2,92,80,15,7,98,122,13,3,81,53,106,76,6,41,71,59,54,87,89,47,1,25,121,38,83,60,37,58,24,8,28,94,84,118,44,108,20,57,51,11,77,129,39,62,115,40,117,78,75,72,112,67,61,128,69,85,5,104,19,70,124,23,10,46,16,100,68,74,9,123,63,131,50,111,135,29,107,34,88,21,32,31,82,30,42,14,90,49,134,22,27,86,132,56,35,96,45,52,91,66,43,102,99,79,116,97,109,133,110,126,113,17,33,0,36,127,103,95,64,125,130,93,73,18,65,120,105,101,4,55,119,114,12,26,48,26],
    px:{
      hand:[0,0,3,9,13,13,14,20,20,21,22,23,26],
      open:[]
    },
    po:{
      hand:[0,1,1,3,6,10,11,17,19,20,24,30,30],
      open:[]
    },
    legalMove:[0,0,0,0,0,1,0],
    out:[],
    turn: -1
  };
  
  function expectMove(
      isOk: boolean,
      turnIndexBeforeMove: number,
      boardBeforeMove: Board,
      pai: number,
      movetype: number,
      boardAfterMove: Board,
      turnIndexAfterMove: number,
      endMatchScores: number[]): void {
    let stateTransition: IStateTransition = {
      turnIndexBeforeMove: turnIndexBeforeMove,
      stateBeforeMove: boardBeforeMove ? {board: boardBeforeMove, delta: null} : null,
      move: {
        endMatchScores: endMatchScores,
        turnIndexAfterMove: turnIndexAfterMove,
        stateAfterMove: {delta: {pai: pai, movetype: movetype}, board: boardAfterMove}
      },
      numberOfPlayers: null
    };
    
    if (isOk) {
      gameLogic.checkMoveOk(stateTransition);
    } else {
      // We expect an exception to be thrown :)
      let didThrowException = false;
      try {
        gameLogic.checkMoveOk(stateTransition);
      } catch (e) {
        didThrowException = true;
      }
      if (!didThrowException) {
        throw new Error("We expect an illegal move, but checkMoveOk didn't throw any exception!")
      }
    }
  }
  
  it("Can get an initiallized board if no state exist", function() {
    let numberOfTimesCalledRandom = 0;
    Math.random = function () {
      numberOfTimesCalledRandom++;
      if (numberOfTimesCalledRandom <= 136) return 1;
      throw new Error("Called Math.random more times than expected");
    };
    let InitialState = gameLogic.getInitialState();
    let board : Board  = {stock:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,26],px:{hand:[0,0,0,0,2,2,2,2,4,4,4,4,6],open:[]},po:{hand:[1,1,1,1,3,3,3,3,5,5,5,5,6],open:[]},legalMove:[0,0,0,0,0,1,0],out:[],turn:-1};
    if (!angular.equals(InitialState.board, board)) {
      throw new Error("Initial board illegal! expecting: " +JSON.stringify(InitialState.board)+ " We got: "+ JSON.stringify(board));
    } 
  });
  
  fit("Seven double HU", function(){
      let hand1 = [0, 1, 3, 5, 7, 8, 5, 4, 3];
      let hand2 = [0, 1, 3, 5, 7, 8, 5, 4, 3, 0, 9, 6, 5, 7];
      let hand3 = [0, 1, 3, 5, 7, 8, 5, 7, 8, 3, 1, 3, 0, 3];
      let hand4 = [0, 0, 1, 3, 3, 5, 5, 7, 7, 8, 8, 9, 9, 1];
      expect(gameLogic.ifSevenDouble(hand1)).toBeFalsy();
      expect(gameLogic.ifSevenDouble(hand2)).toBeFalsy();
      expect(gameLogic.ifSevenDouble(hand3)).toBeTruthy();
      expect(gameLogic.ifSevenDouble(hand4)).toBeTruthy();
  });

  it("Player X make move ZHUA after initiallize is legal", function() {
    expectMove(OK, 0, INITIAL_BOARD, 15, 5,
      {
    stock:[2,92,80,15,7,98,122,13,3,81,53,106,76,6,41,71,59,54,87,89,47,1,25,121,38,83,60,37,58,24,8,28,94,84,118,44,108,20,57,51,11,77,129,39,62,115,40,117,78,75,72,112,67,61,128,69,85,5,104,19,70,124,23,10,46,16,100,68,74,9,123,63,131,50,111,135,29,107,34,88,21,32,31,82,30,42,14,90,49,134,22,27,86,132,56,35,96,45,52,91,66,43,102,99,79,116,97,109,133,110,126,113,17,33,0,36,127,103,95,64,125,130,93,73,18,65,120,105,101,4,55,119,114,12,26,48,27],
    px:{
      hand:[0,0,3,9,13,13,14,20,20,21,22,23,26,15],
      open:[]
    },
    po:{
      hand:[0,1,1,3,6,10,11,17,19,20,24,30,30],
      open:[]
    },
    legalMove:[0,0,0,0,0,0,1],
    out:[],
    turn: 0
  }, 0, NO_ONE_WINS);
  });
  
  it("Player O make move ZHUA after initiallize is illegal", function() {
    expectMove(ILLEGAL, 0, INITIAL_BOARD, 15, 5,
      {
    stock:[2,92,80,15,7,98,122,13,3,81,53,106,76,6,41,71,59,54,87,89,47,1,25,121,38,83,60,37,58,24,8,28,94,84,118,44,108,20,57,51,11,77,129,39,62,115,40,117,78,75,72,112,67,61,128,69,85,5,104,19,70,124,23,10,46,16,100,68,74,9,123,63,131,50,111,135,29,107,34,88,21,32,31,82,30,42,14,90,49,134,22,27,86,132,56,35,96,45,52,91,66,43,102,99,79,116,97,109,133,110,126,113,17,33,0,36,127,103,95,64,125,130,93,73,18,65,120,105,101,4,55,119,114,12,26,48,27],
    px:{
      hand:[0,0,3,9,13,13,14,20,20,21,22,23,26],
      open:[]
    },
    po:{
      hand:[0,1,1,3,6,10,11,17,19,20,24,30,30,15],
      open:[]
    },
    legalMove:[0,0,0,0,0,0,1],
    out:[],
    turn: 0
  }, O_DA_TURN, NO_ONE_WINS);
  });
  
  it("Player X make move Da after ZHUA is legal", function() {
    expectMove(OK, 0, {
      stock:[2,92,80,15,7,98,122,13,3,81,53,106,76,6,41,71,59,54,87,89,47,1,25,121,38,83,60,37,58,24,8,28,94,84,118,44,108,20,57,51,11,77,129,39,62,115,40,117,78,75,72,112,67,61,128,69,85,5,104,19,70,124,23,10,46,16,100,68,74,9,123,63,131,50,111,135,29,107,34,88,21,32,31,82,30,42,14,90,49,134,22,27,86,132,56,35,96,45,52,91,66,43,102,99,79,116,97,109,133,110,126,113,17,33,0,36,127,103,95,64,125,130,93,73,18,65,120,105,101,4,55,119,114,12,26,48,27],
      px:{
        hand:[1,1,6,9,10,11,13,17,19,20,21,24,26,30,30],
        open:[]
      },
      po:{
        hand:[0,0,0,3,3,13,14,15,20,20,22,23,24],
        open:[]
      },
      legalMove:[0,0,0,0,0,0,1],
      out:[],
      turn: 0
    },
    20, 6, {
      stock:[2,92,80,15,7,98,122,13,3,81,53,106,76,6,41,71,59,54,87,89,47,1,25,121,38,83,60,37,58,24,8,28,94,84,118,44,108,20,57,51,11,77,129,39,62,115,40,117,78,75,72,112,67,61,128,69,85,5,104,19,70,124,23,10,46,16,100,68,74,9,123,63,131,50,111,135,29,107,34,88,21,32,31,82,30,42,14,90,49,134,22,27,86,132,56,35,96,45,52,91,66,43,102,99,79,116,97,109,133,110,126,113,17,33,0,36,127,103,95,64,125,130,93,73,18,65,120,105,101,4,55,119,114,12,26,48,27],
      px:{
        hand:[1,1,6,9,10,11,13,17,19,21,24,26,30,30],
        open:[]
      },
      po:{
        hand:[0,0,0,3,3,13,14,15,20,20,22,23,24],
        open:[]
      },
      legalMove:[0,0,0,1,1,1,0],
      out:[20],
      turn: 1
    }, 1, NO_ONE_WINS);
  });

  it("Player X make move Another Da after ZHUA is legal", function() {
    expectMove(OK, 0, {
      stock:[2,92,80,15,7,98,122,13,3,81,53,106,76,6,41,71,59,54,87,89,47,1,25,121,38,83,60,37,58,24,8,28,94,84,118,44,108,20,57,51,11,77,129,39,62,115,40,117,78,75,72,112,67,61,128,69,85,5,104,19,70,124,23,10,46,16,100,68,74,9,123,63,131,50,111,135,29,107,34,88,21,32,31,82,30,42,14,90,49,134,22,27,86,132,56,35,96,45,52,91,66,43,102,99,79,116,97,109,133,110,126,113,17,33,0,36,127,103,95,64,125,130,93,73,18,65,120,105,101,4,55,119,114,12,26,48,27],
      px:{
        hand:[1,1,3,6,9,10,11,17,19,20,21,24,26,30,30],
        open:[]
      },
      po:{
        hand:[0,0,0,3,13,13,14,15,20,20,22,23,24],
        open:[]
      },
      legalMove:[0,0,0,0,0,0,1],
      out:[],
      turn: 0
    },
    20, 6, {
      stock:[2,92,80,15,7,98,122,13,3,81,53,106,76,6,41,71,59,54,87,89,47,1,25,121,38,83,60,37,58,24,8,28,94,84,118,44,108,20,57,51,11,77,129,39,62,115,40,117,78,75,72,112,67,61,128,69,85,5,104,19,70,124,23,10,46,16,100,68,74,9,123,63,131,50,111,135,29,107,34,88,21,32,31,82,30,42,14,90,49,134,22,27,86,132,56,35,96,45,52,91,66,43,102,99,79,116,97,109,133,110,126,113,17,33,0,36,127,103,95,64,125,130,93,73,18,65,120,105,101,4,55,119,114,12,26,48,27],
      px:{
        hand:[1,1,3,6,9,10,11,17,19,21,24,26,30,30],
        open:[]
      },
      po:{
        hand:[0,0,0,3,13,13,14,15,20,20,22,23,24],
        open:[]
      },
      legalMove:[0,0,0,1,0,1,0],
      out:[20],
      turn: 1
    }, 1, NO_ONE_WINS);
  });

  it("Player O make move LEFT CHI after DA by X is legal", function() {
    expectMove(OK, 1, {
      stock:[2,92,80,15,7,98,122,13,3,81,53,106,76,6,41,71,59,54,87,89,47,1,25,121,38,83,60,37,58,24,8,28,94,84,118,44,108,20,57,51,11,77,129,39,62,115,40,117,78,75,72,112,67,61,128,69,85,5,104,19,70,124,23,10,46,16,100,68,74,9,123,63,131,50,111,135,29,107,34,88,21,32,31,82,30,42,14,90,49,134,22,27,86,132,56,35,96,45,52,91,66,43,102,99,79,116,97,109,133,110,126,113,17,33,0,36,127,103,95,64,125,130,93,73,18,65,120,105,101,4,55,119,114,12,26,48,27],
      px:{
        hand:[0,0,3,9,13,13,14,15,20,20,26,30,30],
        open:[]
      },
      po:{
        hand:[0,1,1,3,6,10,11,17,19,20,22,23,24],
        open:[]
      },
      legalMove:[1,1,1,0,0,1,0],
      out:[21],
      turn: 1
    },
    21, 2, {
      stock:[2,92,80,15,7,98,122,13,3,81,53,106,76,6,41,71,59,54,87,89,47,1,25,121,38,83,60,37,58,24,8,28,94,84,118,44,108,20,57,51,11,77,129,39,62,115,40,117,78,75,72,112,67,61,128,69,85,5,104,19,70,124,23,10,46,16,100,68,74,9,123,63,131,50,111,135,29,107,34,88,21,32,31,82,30,42,14,90,49,134,22,27,86,132,56,35,96,45,52,91,66,43,102,99,79,116,97,109,133,110,126,113,17,33,0,36,127,103,95,64,125,130,93,73,18,65,120,105,101,4,55,119,114,12,26,48,27],
      px:{
        hand:[0,0,3,9,13,13,14,15,20,20,26,30,30],
        open:[]
      },
      po:{
        hand:[0,1,1,3,6,10,11,17,22,23,24],
        open:[19,20,21]
      },
      legalMove:[0,0,0,0,0,0,1],
      out:[],
      turn: 2
    }, O_DA_TURN, NO_ONE_WINS);
  });
  it("Player O make move MIDDLE CHI after DA by X is legal", function() {
    expectMove(OK, 1, {
      stock:[2,92,80,15,7,98,122,13,3,81,53,106,76,6,41,71,59,54,87,89,47,1,25,121,38,83,60,37,58,24,8,28,94,84,118,44,108,20,57,51,11,77,129,39,62,115,40,117,78,75,72,112,67,61,128,69,85,5,104,19,70,124,23,10,46,16,100,68,74,9,123,63,131,50,111,135,29,107,34,88,21,32,31,82,30,42,14,90,49,134,22,27,86,132,56,35,96,45,52,91,66,43,102,99,79,116,97,109,133,110,126,113,17,33,0,36,127,103,95,64,125,130,93,73,18,65,120,105,101,4,55,119,114,12,26,48,27],
      px:{
        hand:[0,0,3,9,13,13,14,15,20,20,26,30,30],
        open:[]
      },
      po:{
        hand:[0,1,1,3,6,10,11,17,19,20,22,23,24],
        open:[]
      },
      legalMove:[1,1,1,0,0,1,0],
      out:[21],
      turn: 1
    },
    21, 1, {
      stock:[2,92,80,15,7,98,122,13,3,81,53,106,76,6,41,71,59,54,87,89,47,1,25,121,38,83,60,37,58,24,8,28,94,84,118,44,108,20,57,51,11,77,129,39,62,115,40,117,78,75,72,112,67,61,128,69,85,5,104,19,70,124,23,10,46,16,100,68,74,9,123,63,131,50,111,135,29,107,34,88,21,32,31,82,30,42,14,90,49,134,22,27,86,132,56,35,96,45,52,91,66,43,102,99,79,116,97,109,133,110,126,113,17,33,0,36,127,103,95,64,125,130,93,73,18,65,120,105,101,4,55,119,114,12,26,48,27],
      px:{
        hand:[0,0,3,9,13,13,14,15,20,20,26,30,30],
        open:[]
      },
      po:{
        hand:[0,1,1,3,6,10,11,17,19,23,24],
        open:[20,21,22]
      },
      legalMove:[0,0,0,0,0,0,1],
      out:[],
      turn: 2
    }, O_DA_TURN, NO_ONE_WINS);
  });
  it("Player O make move RIGHT CHI after DA by X is legal", function() {
    expectMove(OK, 1, {
      stock:[2,92,80,15,7,98,122,13,3,81,53,106,76,6,41,71,59,54,87,89,47,1,25,121,38,83,60,37,58,24,8,28,94,84,118,44,108,20,57,51,11,77,129,39,62,115,40,117,78,75,72,112,67,61,128,69,85,5,104,19,70,124,23,10,46,16,100,68,74,9,123,63,131,50,111,135,29,107,34,88,21,32,31,82,30,42,14,90,49,134,22,27,86,132,56,35,96,45,52,91,66,43,102,99,79,116,97,109,133,110,126,113,17,33,0,36,127,103,95,64,125,130,93,73,18,65,120,105,101,4,55,119,114,12,26,48,27],
      px:{
        hand:[0,0,3,9,13,13,14,15,20,20,26,30,30],
        open:[]
      },
      po:{
        hand:[0,1,1,3,6,10,11,17,19,20,22,23,24],
        open:[]
      },
      legalMove:[1,1,1,0,0,1,0],
      out:[21],
      turn: 1
    },
    21, 0, {
      stock:[2,92,80,15,7,98,122,13,3,81,53,106,76,6,41,71,59,54,87,89,47,1,25,121,38,83,60,37,58,24,8,28,94,84,118,44,108,20,57,51,11,77,129,39,62,115,40,117,78,75,72,112,67,61,128,69,85,5,104,19,70,124,23,10,46,16,100,68,74,9,123,63,131,50,111,135,29,107,34,88,21,32,31,82,30,42,14,90,49,134,22,27,86,132,56,35,96,45,52,91,66,43,102,99,79,116,97,109,133,110,126,113,17,33,0,36,127,103,95,64,125,130,93,73,18,65,120,105,101,4,55,119,114,12,26,48,27],
      px:{
        hand:[0,0,3,9,13,13,14,15,20,20,26,30,30],
        open:[]
      },
      po:{
        hand:[0,1,1,3,6,10,11,17,19,20,24],
        open:[21,22,23]
      },
      legalMove:[0,0,0,0,0,0,1],
      out:[],
      turn: 2
    }, O_DA_TURN, NO_ONE_WINS);
  });
  
  it("Player O make move PENG after DA by X is legal", function() {
    expectMove(OK, O_ZHUA_TURN, {
      stock:[2,92,80,15,7,98,122,13,3,81,53,106,76,6,41,71,59,54,87,89,47,1,25,121,38,83,60,37,58,24,8,28,94,84,118,44,108,20,57,51,11,77,129,39,62,115,40,117,78,75,72,112,67,61,128,69,85,5,104,19,70,124,23,10,46,16,100,68,74,9,123,63,131,50,111,135,29,107,34,88,21,32,31,82,30,42,14,90,49,134,22,27,86,132,56,35,96,45,52,91,66,43,102,99,79,116,97,109,133,110,126,113,17,33,0,36,127,103,95,64,125,130,93,73,18,65,120,105,101,4,55,119,114,12,26,48,27],
      px:{
        hand:[0,1,1,3,6,10,11,17,19,21,24,30,30],
        open:[]
      },
      po:{
        hand:[0,0,3,9,13,13,14,15,20,20,22,23,26],
        open:[]
      },
      legalMove:[0,0,0,1,0,1,0],
      out:[20],
      turn: 1
    },
    20, 3, {
      stock:[2,92,80,15,7,98,122,13,3,81,53,106,76,6,41,71,59,54,87,89,47,1,25,121,38,83,60,37,58,24,8,28,94,84,118,44,108,20,57,51,11,77,129,39,62,115,40,117,78,75,72,112,67,61,128,69,85,5,104,19,70,124,23,10,46,16,100,68,74,9,123,63,131,50,111,135,29,107,34,88,21,32,31,82,30,42,14,90,49,134,22,27,86,132,56,35,96,45,52,91,66,43,102,99,79,116,97,109,133,110,126,113,17,33,0,36,127,103,95,64,125,130,93,73,18,65,120,105,101,4,55,119,114,12,26,48,27],
      px:{
        hand:[0,1,1,3,6,10,11,17,19,21,24,30,30],
        open:[]
      },
      po:{
        hand:[0,0,3,9,13,13,14,15,22,23,26],
        open:[20,20,20]
      },
      legalMove:[0,0,0,0,0,0,1],
      out:[],
      turn: 2
    }, O_DA_TURN, NO_ONE_WINS);
  });
  
  it("Player O make move HU after DA by X is legal", function() {
    expectMove(OK, O_ZHUA_TURN, {
      stock:[2,92,80,15,7,98,122,13,3,81,53,106,76,6,41,71,59,54,87,89,47,1,25,121,38,83,60,37,58,24,8,28,94,84,118,44,108,20,57,51,11,77,129,39,62,115,40,117,78,75,72,112,67,61,128,69,85,5,104,19,70,124,23,10,46,16,100,68,74,9,123,63,131,50,111,135,29,107,34,88,21,32,31,82,30,42,14,90,49,134,22,27,86,132,56,35,96,45,52,91,66,43,102,99,79,116,97,109,133,110,126,113,17,33,0,36,127,103,95,64,125,130,93,73,18,65,120,105,101,4,55,119,114,12,26,48,27],
      px:{
        hand:[1,1,6,9,10,11,13,17,19,21,24,26,30,30],
        open:[]
      },
      po:{
        hand:[0,0,0,3,3,13,14,15,20,20,22,23,24],
        open:[]
      },
      legalMove:[0,0,0,1,1,1,0],
      out:[20],
      turn: 1
    },
    20, 4, {
      stock:[2,92,80,15,7,98,122,13,3,81,53,106,76,6,41,71,59,54,87,89,47,1,25,121,38,83,60,37,58,24,8,28,94,84,118,44,108,20,57,51,11,77,129,39,62,115,40,117,78,75,72,112,67,61,128,69,85,5,104,19,70,124,23,10,46,16,100,68,74,9,123,63,131,50,111,135,29,107,34,88,21,32,31,82,30,42,14,90,49,134,22,27,86,132,56,35,96,45,52,91,66,43,102,99,79,116,97,109,133,110,126,113,17,33,0,36,127,103,95,64,125,130,93,73,18,65,120,105,101,4,55,119,114,12,26,48,27],
      px:{
        hand:[1,1,6,9,10,11,13,17,19,21,24,26,30,30],
        open:[]
      },
      po:{
        hand:[0,0,0,3,3,13,14,15,20,20,22,23,24],
        open:[]
      },
      legalMove:[0,0,0,0,0,0,1],
      out:[20],
      turn: -1
    }, NO_ONE_TURN, O_WIN_SCORES);
  });
  
  it("Special case can HU", function() {
    expectMove(OK, O_ZHUA_TURN, {
      stock:[2,92,80,15,7,98,122,13,3,81,53,106,76,6,41,71,59,54,87,89,47,1,25,121,38,83,60,37,58,24,8,28,94,84,118,44,108,20,57,51,11,77,129,39,62,115,40,117,78,75,72,112,67,61,128,69,85,5,104,19,70,124,23,10,46,16,100,68,74,9,123,63,131,50,111,135,29,107,34,88,21,32,31,82,30,42,14,90,49,134,22,27,86,132,56,35,96,45,52,91,66,43,102,99,79,116,97,109,133,110,126,113,17,33,0,36,127,103,95,64,125,130,93,73,18,65,120,105,101,4,55,119,114,12,26,48,27],
      px:{
        hand:[1,1,3,3,6,9,10,11,13,17,19,21,24,26],
        open:[]
      },
      po:{
        hand:[4,5,6,12,13,14,19],
        open:[1,2,3,18,18,18]
      },
      legalMove:[0,0,0,1,1,1,0],
      out:[19],
      turn: 1
    },
    20, 4, {
      stock:[2,92,80,15,7,98,122,13,3,81,53,106,76,6,41,71,59,54,87,89,47,1,25,121,38,83,60,37,58,24,8,28,94,84,118,44,108,20,57,51,11,77,129,39,62,115,40,117,78,75,72,112,67,61,128,69,85,5,104,19,70,124,23,10,46,16,100,68,74,9,123,63,131,50,111,135,29,107,34,88,21,32,31,82,30,42,14,90,49,134,22,27,86,132,56,35,96,45,52,91,66,43,102,99,79,116,97,109,133,110,126,113,17,33,0,36,127,103,95,64,125,130,93,73,18,65,120,105,101,4,55,119,114,12,26,48,27],
      px:{
        hand:[1,1,3,3,6,9,10,11,13,17,19,21,24,26],
        open:[]
      },
      po:{
        hand:[4,5,6,12,13,14,19],
        open:[1,2,3,18,18,18]
      },
      legalMove:[0,0,0,0,0,0,1],
      out:[19],
      turn: -1
    }, NO_ONE_TURN, O_WIN_SCORES);
  });
  
  it("Illegal HU option after DA", function() {
    expectMove(ILLEGAL, 0, {
      stock:[2,92,80,15,7,98,122,13,3,81,53,106,76,6,41,71,59,54,87,89,47,1,25,121,38,83,60,37,58,24,8,28,94,84,118,44,108,20,57,51,11,77,129,39,62,115,40,117,78,75,72,112,67,61,128,69,85,5,104,19,70,124,23,10,46,16,100,68,74,9,123,63,131,50,111,135,29,107,34,88,21,32,31,82,30,42,14,90,49,134,22,27,86,132,56,35,96,45,52,91,66,43,102,99,79,116,97,109,133,110,126,113,17,33,0,36,127,103,95,64,125,130,93,73,18,65,120,105,101,4,55,119,114,12,26,48,27],
      px:{
        hand:[1,1,6,9,10,11,13,17,19,20,21,24,26,30,30],
        open:[]
      },
      po:{
        hand:[0,0,0,3,3,13,14,15,20,20,22,23,24],
        open:[]
      },
      legalMove:[0,0,0,0,0,0,1],
      out:[],
      turn: 0
    },
    21, 6, {
      stock:[2,92,80,15,7,98,122,13,3,81,53,106,76,6,41,71,59,54,87,89,47,1,25,121,38,83,60,37,58,24,8,28,94,84,118,44,108,20,57,51,11,77,129,39,62,115,40,117,78,75,72,112,67,61,128,69,85,5,104,19,70,124,23,10,46,16,100,68,74,9,123,63,131,50,111,135,29,107,34,88,21,32,31,82,30,42,14,90,49,134,22,27,86,132,56,35,96,45,52,91,66,43,102,99,79,116,97,109,133,110,126,113,17,33,0,36,127,103,95,64,125,130,93,73,18,65,120,105,101,4,55,119,114,12,26,48,27],
      px:{
        hand:[1,1,6,9,10,11,13,17,19,20,24,26,30,30],
        open:[]
      },
      po:{
        hand:[0,0,0,3,3,13,14,15,20,20,22,23,24],
        open:[]
      },
      legalMove:[0,0,0,0,1,1,0],
      out:[21],
      turn: 1
    }, 1, NO_ONE_WINS);
  });
  it("Illegal HU option with illegal length of hand", function() {
    expectMove(ILLEGAL, 0, {
      stock:[2,92,80,15,7,98,122,13,3,81,53,106,76,6,41,71,59,54,87,89,47,1,25,121,38,83,60,37,58,24,8,28,94,84,118,44,108,20,57,51,11,77,129,39,62,115,40,117,78,75,72,112,67,61,128,69,85,5,104,19,70,124,23,10,46,16,100,68,74,9,123,63,131,50,111,135,29,107,34,88,21,32,31,82,30,42,14,90,49,134,22,27,86,132,56,35,96,45,52,91,66,43,102,99,79,116,97,109,133,110,126,113,17,33,0,36,127,103,95,64,125,130,93,73,18,65,120,105,101,4,55,119,114,12,26,48,27],
      px:{
        hand:[1,1,6,9,10,11,13,17,19,20,21,24,26,30,30],
        open:[]
      },
      po:{
        hand:[0,0,3,3,13,14,15,20,20,22,23,24],
        open:[]
      },
      legalMove:[0,0,0,0,0,0,1],
      out:[],
      turn: 0
    },
    20, 6, {
      stock:[2,92,80,15,7,98,122,13,3,81,53,106,76,6,41,71,59,54,87,89,47,1,25,121,38,83,60,37,58,24,8,28,94,84,118,44,108,20,57,51,11,77,129,39,62,115,40,117,78,75,72,112,67,61,128,69,85,5,104,19,70,124,23,10,46,16,100,68,74,9,123,63,131,50,111,135,29,107,34,88,21,32,31,82,30,42,14,90,49,134,22,27,86,132,56,35,96,45,52,91,66,43,102,99,79,116,97,109,133,110,126,113,17,33,0,36,127,103,95,64,125,130,93,73,18,65,120,105,101,4,55,119,114,12,26,48,27],
      px:{
        hand:[1,1,6,9,10,11,13,17,19,20,24,26,30,30],
        open:[]
      },
      po:{
        hand:[0,0,3,3,13,14,15,20,20,22,23,24],
        open:[]
      },
      legalMove:[0,0,0,1,1,1,0],
      out:[20],
      turn: 1
    }, 1, NO_ONE_WINS);
  });

  
});
