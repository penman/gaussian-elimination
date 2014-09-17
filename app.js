// Generated by CoffeeScript 1.7.1
(function() {
  var eliminate, reset, solve, toMathML;

  eliminate = function(input) {
    var col, columns, multiplier, output, pass, row, rows, _i, _j, _k, _len, _ref, _ref1;
    rows = input.length;
    columns = input[0].length;
    output = (function() {
      var _i, _results;
      _results = [];
      for (row = _i = 0; 0 <= rows ? _i < rows : _i > rows; row = 0 <= rows ? ++_i : --_i) {
        _results.push((function() {
          var _j, _results1;
          _results1 = [];
          for (col = _j = 0; 0 <= columns ? _j < columns : _j > columns; col = 0 <= columns ? ++_j : --_j) {
            _results1.push(bigRat(input[row][col]));
          }
          return _results1;
        })());
      }
      return _results;
    })();
    _ref = [0, 1];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      pass = _ref[_i];
      for (row = _j = _ref1 = pass + 1; _ref1 <= rows ? _j < rows : _j > rows; row = _ref1 <= rows ? ++_j : --_j) {
        multiplier = output[row][pass].divide(output[pass][pass]);
        for (col = _k = 0; 0 <= columns ? _k < columns : _k > columns; col = 0 <= columns ? ++_k : --_k) {
          output[row][col] = output[pass][col].times(multiplier).minus(output[row][col]);
        }
      }
    }
    return output;
  };

  solve = function(input) {
    var col, columns, row, rows, solutions, _i, _j, _ref, _ref1, _ref2;
    rows = input.length;
    columns = input[0].length;
    solutions = Array(rows);
    for (row = _i = _ref = rows - 1; _i >= 0; row = _i += -1) {
      solutions[row] = input[row][columns - 1];
      for (col = _j = _ref1 = row + 1, _ref2 = columns - 1; _ref1 <= _ref2 ? _j < _ref2 : _j > _ref2; col = _ref1 <= _ref2 ? ++_j : --_j) {
        solutions[row] = solutions[row].minus(input[row][col].times(solutions[col]));
      }
      solutions[row] = solutions[row].divide(input[row][row]);
    }
    return solutions;
  };

  toMathML = function(rat) {
    var math, num;
    num = {
      int: rat.denom.equals(1),
      neg: rat.isNegative(),
      num: rat.abs().num,
      den: rat.denom
    };
    math = "<math>";
    if (num.neg) {
      math += "<mo>-</mo>";
    }
    if (num.int) {
      math += "<mn>" + num.num + "</mn>";
    } else {
      math += "<mfrac><mn>" + num.num + "</mn><mn>" + num.den + "</mn></mfrac>";
    }
    return math += "</math>";
  };

  document.getElementById('calculate-button').addEventListener('click', function() {
    var e, i, input, name, names, output, row, selector, td, tr, value, x, y, _i, _j, _k, _len, _len1, _len2, _ref, _results;
    input = (function() {
      var _i, _len, _ref, _results;
      _ref = document.querySelectorAll('#input-table tbody tr');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tr = _ref[_i];
        _results.push((function() {
          var _j, _len1, _ref1, _results1;
          _ref1 = tr.children;
          _results1 = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            td = _ref1[_j];
            _results1.push(td.children[0].value);
          }
          return _results1;
        })());
      }
      return _results;
    })();
    try {
      output = eliminate(input);
    } catch (_error) {
      e = _error;
      alert("Matrix cannot be eliminated");
      return;
    }
    document.body.setAttribute('class', 'card flipped');
    if (typeof history.pushState === "function") {
      history.pushState();
    }
    for (x = _i = 0, _len = output.length; _i < _len; x = ++_i) {
      row = output[x];
      for (y = _j = 0, _len1 = row.length; _j < _len1; y = ++_j) {
        value = row[y];
        selector = "#output-table tr:nth-child(" + (x + 1) + ") td:nth-child(" + (y + 1) + ")";
        document.querySelector(selector).innerHTML = toMathML(value);
      }
    }
    names = ['x', 'y', 'z'];
    _ref = solve(output);
    _results = [];
    for (i = _k = 0, _len2 = _ref.length; _k < _len2; i = ++_k) {
      value = _ref[i];
      name = names[i];
      _results.push(document.getElementById(name).innerHTML = "<math><mi>" + name + "</mi> <mo>=</mo> <mn>" + value + "</mn></math>");
    }
    return _results;
  });

  reset = function() {
    document.body.setAttribute('class', 'card');
    return setTimeout((function() {
      return document.querySelector('#input-table input').focus();
    }), 1000);
  };

  window.addEventListener('popstate', reset);

  document.getElementById('reset-button').addEventListener('click', function() {
    if (history.pushState != null) {
      return history.back();
    } else {
      return reset();
    }
  });

}).call(this);