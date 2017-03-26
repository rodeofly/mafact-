(function() {
  var CHALLENGES, CURRENT_LEVEL, ECHELLES, Echelle, ID, ILETS, Ilet, SOLUTION, audioElement, base, delay, html, i, m, maxi, mini;

  if ((base = Array.prototype).shuffle == null) {
    base.shuffle = function() {
      var i, j, m, ref, ref1;
      if (this.length > 1) {
        for (i = m = ref = this.length - 1; ref <= 1 ? m <= 1 : m >= 1; i = ref <= 1 ? ++m : --m) {
          j = Math.floor(Math.random() * (i + 1));
          ref1 = [this[j], this[i]], this[i] = ref1[0], this[j] = ref1[1];
        }
      }
      return this;
    };
  }

  delay = function(ms, func) {
    return setTimeout(func, ms);
  };

  ID = 1;

  SOLUTION = [];

  ILETS = [];

  ECHELLES = [];

  CURRENT_LEVEL = 0;

  CHALLENGES = {
    1: {
      "ilets": [1, 4, 3],
      "echelles": [3, 1]
    },
    2: {
      "ilets": [1, 3, 4, 5],
      "echelles": [1, 2, 3]
    },
    3: {
      "ilets": [3, 1, 10, 9],
      "echelles": [7, 8, 9]
    },
    4: {
      "ilets": [1, 2, 4, 5, 3],
      "echelles": [1, 2, 3, 4]
    },
    5: {
      "ilets": [1, 4, 9, 10, 2],
      "echelles": [5, 6, 7, 9]
    },
    6: {
      "ilets": [1, 2, 5, 8, 10, 9],
      "echelles": [4, 5, 6, 7, 8]
    },
    7: {
      "ilets": [1, 2, 3, 6, 7, 4],
      "echelles": [1, 2, 3, 4, 5]
    },
    8: {
      "ilets": [1, 2, 4, 5, 9, 10, 6],
      "echelles": [1, 2, 3, 4, 5, 6]
    },
    9: {
      "ilets": [7, 1, 2, 3, 5, 10, 8],
      "echelles": [1, 2, 3, 4, 5, 6]
    },
    10: {
      "ilets": [5, 3, 4, 6, 7, 8, 10, 9],
      "echelles": [1, 2, 3, 4, 5, 6, 7]
    },
    12: {
      "ilets": [1, 2, 3, 4, 8, 9, 10, 5],
      "echelles": [1, 8, 7, 6, 5, 4, 3]
    },
    13: {
      "ilets": [3, 1, 2, 5, 6, 7, 9, 10, 4],
      "echelles": [1, 1, 3, 4, 5, 6, 7, 8]
    },
    14: {
      "ilets": [7, 1, 2, 4, 5, 6, 9, 10, 8],
      "echelles": [1, 1, 3, 4, 5, 6, 7, 8]
    },
    15: {
      "ilets": [2, 1, 3, 4, 5, 7, 8, 9, 10, 6],
      "echelles": [1, 3, 3, 4, 5, 6, 7, 8, 9]
    },
    16: {
      "ilets": [2, 1, 3, 4, 5, 6, 7, 9, 10, 8],
      "echelles": [1, 2, 2, 4, 5, 6, 7, 8, 9]
    }
  };

  Ilet = (function() {
    function Ilet(altitude1) {
      this.altitude = altitude1;
      this.html = "<div class='spot'>\n    <div class='ilet' data-altitude='" + this.altitude + "'>\n       <span class='info'>" + this.altitude + "</span>       \n    </div>\n    <div class='via' data-denivelle='0'></div>\n</div>";
    }

    return Ilet;

  })();

  Echelle = (function() {
    function Echelle(hauteur) {
      this.hauteur = hauteur;
      this.html = "<div class='echelle' data-hauteur='" + this.hauteur + "'>\n  <span class='info'>" + this.hauteur + "</span>\n</div>";
    }

    return Echelle;

  })();

  mini = function(echelle) {
    var h;
    h = echelle.attr("data-hauteur");
    echelle.css({
      position: "relative",
      height: (25 * h) + "px",
      width: "25px",
      backgroundSize: "100% 100%",
      background: "url(css/images/uniteS.png) repeat-y"
    });
    return echelle.find(".info").css({
      top: "5px",
      left: "8px",
      fontSize: "1em",
      color: "black"
    });
  };

  maxi = function(echelle) {
    var h;
    h = echelle.attr("data-hauteur");
    echelle.css({
      position: "absolute",
      height: (50 * h) + "px",
      width: "50px",
      backgroundSize: "100% 100%",
      background: "url(css/images/unite.png) repeat-y"
    });
    return echelle.find(".info").css({
      top: "10px",
      left: "15px",
      fontSize: "2em",
      color: "grey"
    });
  };

  html = "<div id='close'>x</div><div id='levels'>";

  for (i = m = 1; m <= 16; i = ++m) {
    html += "<div class='level' data-level='" + i + "'>" + i + "</div>";
  }

  html += "<div class='more'>+</div>";

  html += "<div id='more'>\n    <div id='random'>Aléatoire</div>\n    <div id='solution'>Soluce</div>\n    <div id='sliderInfo'>Niveaux :\n        <span id='amount-slider'></span>\n        <div id='slider'></div>\n    </div>\n </div></div>";

  audioElement = document.createElement('audio');

  audioElement.setAttribute('src', 'sounds/maloya-fast.wav');

  audioElement.load();

  $(function() {
    var checkit, draw, randFloat, randint, random;
    $("#parametres").append(html);
    $("#parametres").draggable();
    $("#param_button").button().on("click", function() {
      $("#more").hide();
      return $("#parametres").toggle();
    });
    checkit = function() {
      var bleues, climbAndJump, delai, scales;
      $(".echelle").removeClass("shine-right shine-wrong");
      $(".spot").each(function() {
        var $next_spot, curr_alt, current_scale, deniv, height, next_alt, scale, via, yPos;
        $next_spot = $(this).next(".spot");
        via = $(this).find(".via");
        if ($next_spot.length) {
          curr_alt = parseInt($(this).find(".ilet").attr("data-altitude"));
          next_alt = parseInt($next_spot.find(".ilet").attr("data-altitude"));
          deniv = curr_alt - next_alt;
          height = Math.abs(deniv);
          yPos = deniv > 0 ? next_alt : curr_alt;
          via.attr("data-denivelle", deniv).css({
            height: (height * 50) + "px",
            bottom: (yPos * 50) + "px"
          });
          if (via.find(".echelle").length > 0) {
            scale = parseInt(via.find(".echelle").attr("data-hauteur"));
            if (scale === height) {
              return via.find(".echelle").addClass("shine-right");
            } else {
              current_scale = via.find(".echelle").appendTo($("#echelles"));
              return mini(current_scale);
            }
          }
        } else {
          return via.hide();
        }
      });
      bleues = $(".shine-right").length;
      scales = $(".echelle").length;
      delai = 100;
      climbAndJump = function(c, i) {
        var alt, altitude, diveornot, ilet, parent, via;
        diveornot = function() {
          var altimetre, offset;
          offset = $("#facteur").offset();
          altimetre = (parseInt($("#laReunion").height()) - parseInt(offset.top)) + 50;
          console.log("altimetre = " + altimetre);
          if (altimetre < 0) {
            return $("#facteur").addClass("dive");
          } else {
            console.log("undive");
            return $("#facteur").removeClass("dive");
          }
        };
        diveornot();
        parent = $("#facteur").parent();
        if (parent.hasClass("ilet")) {
          via = parent.siblings(".via:first()");
          if (via.find(".echelle").length > 0) {
            return delay(delai, function() {
              var altitude, d;
              d = parseInt(via.attr("data-denivelle"));
              via.find(".echelle").append($("#facteur"));
              i = Math.abs(d);
              altitude = parseInt($("#facteur").closest(".spot").next(".spot").find(".ilet").attr("data-altitude"));
              switch (d > 0) {
                case true:
                  if (altitude < 0) {
                    console.log("echelle descend vers le négatif");
                    $("#facteur").css({
                      top: "-50px",
                      bottom: "auto",
                      left: "40%"
                    });
                  } else {
                    console.log("echelle descend vers le positif");
                    $("#facteur").css({
                      top: "-50px",
                      bottom: "auto",
                      left: "40%"
                    });
                  }
                  return climbAndJump(1, i);
                default:
                  if (altitude < 0) {
                    console.log("echelle monte vers le négatif");
                    $("#facteur").css({
                      top: "auto",
                      bottom: "0px",
                      left: "40%"
                    });
                  } else {
                    console.log("echelle monte vers le positif");
                    $("#facteur").css({
                      top: "auto",
                      bottom: "0px",
                      left: "40%"
                    });
                  }
                  return climbAndJump(-1, i);
              }
            });
          } else {
            if ($("#facteur").closest(".spot").is($(".spot:last"))) {
              if (altitude < 0) {
                $("#facteur").css({
                  top: "auto",
                  bottom: "0px",
                  left: "40%"
                });
              }
              $("#facteur").addClass("pause");
              return audioElement.play();
            }
          }
        } else {
          altitude = parseInt($("#facteur").closest(".spot").next(".spot").find(".ilet").attr("data-altitude"));
          if (i) {
            i--;
            alt = parseInt($("#facteur").css("top"));
            return delay(delai, function() {
              if (altitude < 0) {
                $("#facteur").css({
                  top: (alt + c * 50) + "px"
                });
              } else {
                $("#facteur").css({
                  top: (alt + c * 50) + "px"
                });
              }
              return climbAndJump(c, i);
            });
          } else {
            ilet = $("#facteur").closest(".spot").next(".spot").find(".ilet");
            return delay(delai, function() {
              ilet.append($("#facteur"));
              if (altitude < 0) {
                $("#facteur").css({
                  top: (ilet.height() - 50) + "px",
                  left: "40%"
                });
              } else {
                $("#facteur").css({
                  top: "-50px",
                  left: "40%"
                });
              }
              return climbAndJump(c, i);
            });
          }
        }
      };
      if (bleues === scales) {
        $("#echelles").append("<div id='gagne'>Oté, c'est gagné !</div>");
        $("#laReunion").fireworks();
        $(".echelle").draggable("destroy");
        $("#mafate").sortable("destroy");
        climbAndJump();
        $(".level[data-level='" + CURRENT_LEVEL + "']").addClass("green");
        return delay(5000, function() {
          return $("#parametres").show();
        });
      }
    };
    draw = function() {
      var echelle, f, h, height, ilet, l, len, len1, o, p;
      $("#mafate, #echelles").empty();
      for (o = 0, len = ILETS.length; o < len; o++) {
        i = ILETS[o];
        ilet = new Ilet(i);
        $("#mafate").append(ilet.html);
        ilet = $(".ilet[data-altitude='" + ilet.altitude + "']");
        ilet.css({
          height: (50 * Math.abs(i)) + "px",
          backgroundPosition: "5px " + (h - 50) + "px"
        });
        if (i < 0) {
          ilet.css({
            bottom: (50 * i) + "px",
            background: "#c6c4f1 url(images/strate.png) repeat"
          });
          ilet.find(".info").css({
            bottom: "0px"
          });
        } else {
          ilet.css({
            bottom: "0px"
          });
        }
      }
      $(".ilet").first().addClass("first-ilet");
      $(".ilet").last().addClass("last-ilet");
      f = parseInt($(".first-ilet").attr("data-altitude"));
      l = parseInt($(".last-ilet").attr("data-altitude"));
      if (f < 0) {
        $(".first-ilet").css({
          background: "#1007cb url(images/strate.png) repeat"
        });
        $(".first-ilet").find(".info").css({
          color: "white"
        });
      }
      if (l < 0) {
        $(".last-ilet").css({
          background: "#1007cb url(images/strate.png) repeat"
        });
        $(".last-ilet").find(".info").css({
          color: "white"
        });
      }
      height = $("#mafate .ilet:first").attr("data-altitude");
      $("#riveG").css({
        backgroundSize: "100px " + (height * 50) + "px",
        backgroundPosition: "bottom"
      });
      $(".spot:first .ilet").append("<div id='facteur'></div>");
      $("#facteur").css({
        top: "-50px",
        left: "40%"
      });
      height = $("#mafate .ilet:last").attr("data-altitude");
      h = $(".spot:last").height() - height * 50;
      $(".spot:last").css({
        background: "url(css/images/case.png) no-repeat",
        backgroundPosition: "5px " + (h - 50) + "px"
      });
      $("#riveD").css({
        backgroundSize: "100px " + (height * 50) + "px",
        backgroundPosition: "bottom"
      });
      for (p = 0, len1 = ECHELLES.length; p < len1; p++) {
        i = ECHELLES[p];
        echelle = new Echelle(i);
        $("#echelles").append(echelle.html);
        echelle = $(".echelle[data-hauteur='" + echelle.hauteur + "']");
        mini(echelle);
      }
      $("#mafate").sortable({
        items: '.spot:not(:first, :last)',
        stop: function() {
          $(".spot:first .ilet").append($("#facteur"));
          return checkit();
        }
      });
      $("#echelles").draggable({
        containment: "#laReunion"
      });
      $(".echelle").draggable({
        helper: "clone",
        appendTo: "body",
        revert: function(valid_drop) {
          if (!valid_drop && $(this).parent().is("#echelles")) {
            return mini($(this));
          } else {
            return true;
          }
        },
        start: function(event, ui) {
          ui.helper.css('z-index', "10");
          return maxi(ui.helper);
        }
      });
      $(".echelle").on("dblclick", function() {
        var current_scale, len2, p, ref, results, scale_height, via;
        current_scale = $(this);
        scale_height = current_scale.data('hauteur');
        ref = $("#mafate").find(".via[data-denivelle!=0]");
        results = [];
        for (p = 0, len2 = ref.length; p < len2; p++) {
          via = ref[p];
          if ($(via).find('.echelle').length) {
            continue;
          }
          if (Math.abs($(via).data("denivelle")) === scale_height) {
            $(via).append(current_scale);
            maxi(current_scale);
            checkit();
            break;
          } else {
            results.push(void 0);
          }
        }
        return results;
      });
      $("#echelles, #mafate").droppable({
        tolerance: 'touch',
        accept: '.echelle',
        drop: function(event, ui) {
          ui.helper.remove();
          $("#echelles").append(ui.draggable);
          return mini(ui.draggable);
        }
      });
      return $(".via").droppable({
        tolerance: 'touch',
        accept: function(d) {
          return d.is(".echelle") && $(this).is(":empty");
        },
        activeClass: "shine-yellow",
        hoverClass: "shine-white",
        drop: function(event, ui) {
          var current_scale, scaleHeight, viaHeight;
          ui.helper.remove();
          viaHeight = Math.abs(parseInt($(this).attr("data-denivelle")));
          scaleHeight = parseInt(ui.draggable.attr("data-hauteur"));
          current_scale = $(this).find(".echelle");
          if (viaHeight === scaleHeight) {
            $(this).append(ui.draggable);
            maxi(ui.draggable);
            if (current_scale.length) {
              $("#echelles").append(current_scale);
              mini(current_scale);
            }
            return checkit();
          } else {
            return ui.draggable.draggable('option', 'revert', function() {
              if ($(this).parent().is("#echelles")) {
                mini($(this));
              }
              return true;
            });
          }
        }
      });
    };
    randFloat = function(min, max) {
      return Math.random() * (max - min) + min;
    };
    randint = function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    random = function(n) {
      var first, genere, k, last, ref;
      genere = function(xz, n) {
        var epsilon, k, len, o, p, q, r, ref, ref1, ref2, ref3, ref4, ref5, results, results1, s, sigma, t, tau, x, y;
        epsilon = [];
        for (k = o = 1, ref = n + 1; 1 <= ref ? o <= ref : o >= ref; k = 1 <= ref ? ++o : --o) {
          epsilon.push(2 * randint(0, 1) - 1);
        }
        console.log("epsilon = " + epsilon);
        tau = (function() {
          results = [];
          for (var p = 1, ref1 = n + 1; 1 <= ref1 ? p <= ref1 : p >= ref1; 1 <= ref1 ? p++ : p--){ results.push(p); }
          return results;
        }).apply(this).shuffle();
        console.log("tau = " + tau);
        y = [xz];
        for (k = q = 0, ref2 = n; 0 <= ref2 ? q <= ref2 : q >= ref2; k = 0 <= ref2 ? ++q : --q) {
          y.push(y[k] + epsilon[k] * tau[k]);
        }
        console.log("y = " + y);
        sigma = [0];
        ref4 = (function() {
          results1 = [];
          for (var s = 1, ref3 = n + 1; 1 <= ref3 ? s <= ref3 : s >= ref3; 1 <= ref3 ? s++ : s--){ results1.push(s); }
          return results1;
        }).apply(this).shuffle();
        for (r = 0, len = ref4.length; r < len; r++) {
          k = ref4[r];
          sigma.push(k);
        }
        console.log("sigma = " + sigma);
        x = [xz];
        for (k = t = 1, ref5 = n; 1 <= ref5 ? t <= ref5 : t >= ref5; k = 1 <= ref5 ? ++t : --t) {
          x.push(y[sigma[k]]);
        }
        x[n + 1] = y[n + 1];
        console.log("x = " + x);
        return SOLUTION = y;
      };
      genere(randint(1, n), n);
      ECHELLES = (function() {
        var len, o, p, ref, ref1, results, results1;
        ref1 = (function() {
          results1 = [];
          for (var p = 1, ref = n + 1; 1 <= ref ? p <= ref : p >= ref; 1 <= ref ? p++ : p--){ results1.push(p); }
          return results1;
        }).apply(this).shuffle();
        results = [];
        for (o = 0, len = ref1.length; o < len; o++) {
          k = ref1[o];
          results.push(k);
        }
        return results;
      })();
      ILETS = SOLUTION;
      ref = [ILETS.shift(), ILETS.pop()], first = ref[0], last = ref[1];
      ILETS.shuffle();
      ILETS = [first].concat(ILETS).concat([last]);
      draw();
      return checkit();
    };
    $("#amount-slider").html("7");
    $("#slider").slider({
      range: "max",
      min: 2,
      max: 7,
      step: 1,
      value: 6,
      slide: function(event, ui) {
        var n;
        $("#gagne").remove();
        $("#laReunion").fireworks('destroy');
        $("#amount-slider").html(ui.value);
        return random(n = parseInt($("#amount-slider").html()));
      }
    });
    $(".level").button().on("click", function() {
      var first, last, level, ref;
      $("#parametres").hide();
      level = parseInt($(this).attr("data-level"));
      $("#gagne").remove();
      $("#laReunion").fireworks('destroy');
      SOLUTION = CHALLENGES[level].ilets;
      ECHELLES = CHALLENGES[level].echelles.shuffle();
      ILETS = SOLUTION.slice(0);
      ref = [ILETS.shift(), ILETS.pop()], first = ref[0], last = ref[1];
      ILETS = [first].concat(ILETS.shuffle()).concat([last]);
      SOLUTION = [];
      CURRENT_LEVEL = level;
      draw();
      return checkit();
    });
    $("#close").button().on("click", function() {
      return $("#parametres").hide();
    });
    $("#random").button().on("click", function() {
      var n;
      $("#gagne").remove();
      $("#laReunion").fireworks('destroy');
      return random(n = parseInt($("#amount-slider").html()));
    });
    $("#solution").button().on("click", function() {
      if (SOLUTION.length > 0) {
        ILETS = SOLUTION;
      }
      draw();
      return checkit();
    });
    $(".more").button().on("click", function() {
      return $("#more").show();
    });
    $(".level[data-level='1']").trigger("click");
    return $("#param_button").trigger("click");
  });

}).call(this);

//# sourceMappingURL=main.js.map
