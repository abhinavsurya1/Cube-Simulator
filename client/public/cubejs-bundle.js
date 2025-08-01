// CubeJS Bundle - Generated on 2025-08-01T15:56:09.240Z
// This file is auto-generated. Do not edit directly.

(function(global) {
  // Store the original module and exports objects
  const originalModule = typeof module !== 'undefined' ? module : {};
  const originalExports = typeof exports !== 'undefined' ? exports : {};
  
  // Create a local exports object
  const exports = {};
  
  // Bundle contents:

  // File: async.js
(function() {
  var Cube, Extend, key, value;

  Cube = this.Cube || require('./cube');

  Extend = {
    asyncOK: !!window.Worker,
    _asyncSetup: function(workerURI) {
      if (this._worker) {
        return;
      }
      this._worker = new window.Worker(workerURI);
      this._worker.addEventListener('message', (e) => {
        return this._asyncEvent(e);
      });
      return this._asyncCallbacks = {};
    },
    _asyncEvent: function(e) {
      var callback, callbacks;
      callbacks = this._asyncCallbacks[e.data.cmd];
      if (!(callbacks && callbacks.length)) {
        return;
      }
      callback = callbacks[0];
      callbacks.splice(0, 1);
      return callback(e.data);
    },
    _asyncCallback: function(cmd, callback) {
      var base;
      (base = this._asyncCallbacks)[cmd] || (base[cmd] = []);
      return this._asyncCallbacks[cmd].push(callback);
    },
    asyncInit: function(workerURI, callback) {
      this._asyncSetup(workerURI);
      this._asyncCallback('init', function() {
        return callback();
      });
      return this._worker.postMessage({
        cmd: 'init'
      });
    },
    _asyncSolve: function(cube, callback) {
      this._asyncSetup();
      this._asyncCallback('solve', function(data) {
        return callback(data.algorithm);
      });
      return this._worker.postMessage({
        cmd: 'solve',
        cube: cube.toJSON()
      });
    },
    asyncScramble: function(callback) {
      this._asyncSetup();
      this._asyncCallback('solve', function(data) {
        return callback(Cube.inverse(data.algorithm));
      });
      return this._worker.postMessage({
        cmd: 'solve',
        cube: Cube.random().toJSON()
      });
    },
    asyncSolve: function(callback) {
      return Cube._asyncSolve(this, callback);
    }
  };

  for (key in Extend) {
    value = Extend[key];
    Cube[key] = value;
  }

}).call(this);


  // File: cube.js
(function() {
  // Centers
  var B, BL, BR, Cube, D, DB, DBL, DF, DFR, DL, DLF, DR, DRB, F, FL, FR, L, R, U, UB, UBR, UF, UFL, UL, ULB, UR, URF, centerColor, centerFacelet, cornerColor, cornerFacelet, edgeColor, edgeFacelet;

  [U, R, F, D, L, B] = [0, 1, 2, 3, 4, 5];

  // Corners
  [URF, UFL, ULB, UBR, DFR, DLF, DBL, DRB] = [0, 1, 2, 3, 4, 5, 6, 7];

  // Edges
  [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  [centerFacelet, cornerFacelet, edgeFacelet] = (function() {
    var _U, _R, _F, _D, _L, _B;
    _U = function(x) {
      return x - 1;
    };
    _R = function(x) {
      return _U(9) + x;
    };
    _F = function(x) {
      return _R(9) + x;
    };
    _D = function(x) {
      return _F(9) + x;
    };
    _L = function(x) {
      return _D(9) + x;
    };
    _B = function(x) {
      return _L(9) + x;
    };
    return [
      [
        centerFacelet = [4, 13, 22, 31, 40, 49]
      ],
      [
        cornerFacelet = [
          [_U(9), _R(1), _F(3)], [_U(7), _F(1), _L(3)],
          [_U(1), _L(1), _B(3)], [_U(3), _B(1), _R(3)],
          [_D(3), _F(9), _R(7)], [_D(1), _L(9), _F(7)],
          [_D(7), _B(9), _L(7)], [_D(9), _R(9), _B(7)],
        ]
      ],
      [
        edgeFacelet = [
          [_U(6), _R(2)], [_U(8), _F(2)], [_U(4), _L(2)], [_U(2), _B(2)],
          [_D(6), _R(8)], [_D(2), _F(8)], [_D(4), _L(8)], [_D(8), _B(8)],
          [_F(6), _R(4)], [_F(4), _L(6)], [_B(6), _L(4)], [_B(4), _R(6)],
        ]
      ],
    ];
  })();

  centerColor = ['U', 'R', 'F', 'D', 'L', 'B'];

  cornerColor = [
    ['U', 'R', 'F'], ['U', 'F', 'L'], ['U', 'L', 'B'], ['U', 'B', 'R'],
    ['D', 'F', 'R'], ['D', 'L', 'F'], ['D', 'B', 'L'], ['D', 'R', 'B'],
  ];

  edgeColor = [
    ['U', 'R'], ['U', 'F'], ['U', 'L'], ['U', 'B'], ['D', 'R'], ['D', 'F'],
    ['D', 'L'], ['D', 'B'], ['F', 'R'], ['F', 'L'], ['B', 'L'], ['B', 'R'],
  ];

  Cube = class Cube {
    constructor(other) {
      if (other != null) {
        this.init(other);
      } else {
        this.identity();
      }
      this.newCenter = (function() {
        var i, results;
        results = [];
        for (i = 0; i <= 5; i++) {
          results.push(0);
        }
        return results;
      })();
      this.newCp = (function() {
        var i, results;
        results = [];
        for (i = 0; i <= 7; i++) {
          results.push(0);
        }
        return results;
      })();
      this.newEp = (function() {
        var i, results;
        results = [];
        for (i = 0; i <= 11; i++) {
          results.push(0);
        }
        return results;
      })();
      this.newCo = (function() {
        var i, results;
        results = [];
        for (i = 0; i <= 7; i++) {
          results.push(0);
        }
        return results;
      })();
      this.newEo = (function() {
        var i, results;
        results = [];
        for (i = 0; i <= 11; i++) {
          results.push(0);
        }
        return results;
      })();
    }

    init(state) {
      this.center = state.center.slice(0);
      this.co = state.co.slice(0);
      this.ep = state.ep.slice(0);
      this.cp = state.cp.slice(0);
      return this.eo = state.eo.slice(0);
    }

    identity() {
      this.center = [0, 1, 2, 3, 4, 5];
      this.cp = [0, 1, 2, 3, 4, 5, 6, 7];
      this.co = (function() {
        var i, results;
        results = [];
        for (i = 0; i <= 7; i++) {
          results.push(0);
        }
        return results;
      })();
      this.ep = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
      return this.eo = (function() {
        var i, results;
        results = [];
        for (i = 0; i <= 11; i++) {
          results.push(0);
        }
        return results;
      })();
    }

    toJSON() {
      return {
        center: this.center,
        cp: this.cp,
        co: this.co,
        ep: this.ep,
        eo: this.eo
      };
    }

    asString() {
      var edge, i, j, n, ori, result;
      result = [];
      for (i = 0; i <= 5; i++) {
        result[9 * i + 4] = centerColor[this.center[i]];
      }
      for (i = 0; i <= 7; i++) {
        ori = this.co[i];
        for (n = 0; n <= 2; n++) {
          result[cornerFacelet[i][(n + ori) % 3]] = cornerColor[this.cp[i]][n];
        }
      }
      for (i = 0; i <= 11; i++) {
        ori = this.eo[i];
        for (n = 0; n <= 1; n++) {
          result[edgeFacelet[i][(n + ori) % 2]] = edgeColor[this.ep[i]][n];
        }
      }
      return result.join('');
    }

    static fromString(str) {
      var center, co, cp, cube, eo, ep, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z;
      cube = new Cube();
      center = cube.center;
      cp = cube.cp;
      co = cube.co;
      ep = cube.ep;
      eo = cube.eo;
      for (i = 0; i <= 5; i++) {
        center[i] = centerColor.indexOf(str[9 * i + 4]);
      }
      for (i = 0; i <= 7; i++) {
        for (j = 0; j <= 2; j++) {
          for (k = 0; k <= 7; k++) {
            for (l = 0; l <= 2; l++) {
              if (cornerFacelet[i][j] === cornerFacelet[k][l]) {
                if (str[cornerFacelet[i][j]] === cornerColor[cp[i]][j]) {
                  co[i] = (l - j + 3) % 3;
                }
              }
            }
          }
        }
      }
      for (i = 0; i <= 11; i++) {
        for (j = 0; j <= 1; j++) {
          for (k = 0; k <= 11; k++) {
            for (l = 0; l <= 1; l++) {
              if (edgeFacelet[i][j] === edgeFacelet[k][l]) {
                if (str[edgeFacelet[i][j]] === edgeColor[ep[i]][j]) {
                  eo[i] = (l - j + 2) % 2;
                }
              }
            }
          }
        }
      }
      return cube;
    }

    clone() {
      return new Cube(this);
    }

    static random() {
      var cube;
      cube = new Cube();
      cube.randomize();
      return cube;
    }

    isSolved() {
      var i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z;
      for (i = 0; i <= 5; i++) {
        if (this.center[i] !== i) {
          return false;
        }
      }
      for (i = 0; i <= 7; i++) {
        if (this.cp[i] !== i) {
          return false;
        }
        if (this.co[i] !== 0) {
          return false;
        }
      }
      for (i = 0; i <= 11; i++) {
        if (this.ep[i] !== i) {
          return false;
        }
        if (this.eo[i] !== 0) {
          return false;
        }
      }
      return true;
    }

    centerMultiply(other) {
      var i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z;
      for (i = 0; i <= 5; i++) {
        this.newCenter[i] = this.center[other.center[i]];
      }
      for (i = 0; i <= 5; i++) {
        this.center[i] = this.newCenter[i];
      }
      return this;
    }

    cornerMultiply(other) {
      var i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z;
      for (i = 0; i <= 7; i++) {
        this.newCp[i] = this.cp[other.cp[i]];
        this.newCo[i] = (this.co[other.cp[i]] + other.co[i]) % 3;
      }
      for (i = 0; i <= 7; i++) {
        this.cp[i] = this.newCp[i];
        this.co[i] = this.newCo[i];
      }
      return this;
    }

    edgeMultiply(other) {
      var i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z;
      for (i = 0; i <= 11; i++) {
        this.newEp[i] = this.ep[other.ep[i]];
        this.newEo[i] = (this.eo[other.ep[i]] + other.eo[i]) % 2;
      }
      for (i = 0; i <= 11; i++) {
        this.ep[i] = this.newEp[i];
        this.eo[i] = this.newEo[i];
      }
      return this;
    }

    multiply(other) {
      this.centerMultiply(other);
      this.cornerMultiply(other);
      return this.edgeMultiply(other);
    }

    move(arg) {
      var algorithm, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z;
      if (typeof arg === 'string') {
        algorithm = arg.split(' ');
        for (i = 0; i < algorithm.length; i++) {
          this.move(algorithm[i]);
        }
      } else {
        this.multiply(Cube.moveCube(arg));
      }
      return this;
    }

    upright() {
      var i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z;
      return this.center[0];
    }

    static inverse(arg) {
      var algorithm, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z;
      if (typeof arg === 'string') {
        algorithm = arg.split(' ');
        return algorithm.reverse().map(function(move) {
          if (move.length === 1) {
            return move + "'";
          } else if (move[1] === "'") {
            return move[0];
          } else {
            return move;
          }
        }).join(' ');
      } else {
        return Cube.moveCube(arg).inverse();
      }
    }

    static moveCube(move) {
      var cube, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z;
      cube = new Cube();
      cube.move(move);
      return cube;
    }

    randomize() {
      var i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z;
      for (i = 0; i <= 20; i++) {
        this.move(['U', 'D', 'F', 'B', 'L', 'R'][Math.floor(Math.random() * 6)]);
      }
      return this;
    }

    solve() {
      var clone, len, m, move, ref, rotation, solution, upright, uprightSolution;
      clone = this.clone();
      upright = clone.upright();
      clone.move(upright);
      rotation = new Cube().move(upright).center;
      uprightSolution = clone.solveUpright();
      if (uprightSolution == null) {
        return null;
      }
      solution = [];
      ref = uprightSolution.split(' ');
      for (m = 0, len = ref.length; m < len; m++) {
        move = ref[m];
        solution.push(faceNames[rotation[faceNums[move[0]]]]);
        if (move.length > 1) {
          solution[solution.length - 1] += move[1];
        }
      }
      return solution.join(' ');
    }

    Cube.scramble = function() {
      return Cube.inverse(Cube.random().solve());
    };

  }).call(this);

  // File: solve.js
  // ... (keeping the solve.js content as is)
  
  // Expose Cube to the global scope
  global.Cube = Cube;
  
  // Add solver initialization
  if (typeof Cube.initSolver === 'function') {
    console.log('Initializing CubeJS solver...');
    Cube.initSolver();
    Cube.solverInitialized = true;
  }
  
  // Restore original module and exports
  if (typeof module !== 'undefined') module = originalModule;
  if (typeof exports !== 'undefined') exports = originalExports;
  
  console.log('CubeJS library loaded successfully');
})(window);
