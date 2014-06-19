
// Quick and dirty coderun plugn for bespoke.
// By Bramus! - http://bram.us/ - @bramus
bespoke.plugins.coderun = function(deck) {

  // Helper Function to strip HTML from a string
  var stripHTMLDiv = document.createElement('div');
  var stripHTML = function(html) {
    stripHTMLDiv.innerHTML = html;
    return stripHTMLDiv.textContent || stripHTMLDiv.innerText;
  };

  // Override console.log so that we can append output to our code snippets
  (function() {
    var exLog = console.log;
    console.log = function(msg) {
        exLog.apply(this, arguments);
        insertTextAtCursor(' // ' + msg);
    }
  })()

  // Inserts text at the cursor position of a contenteditable block
  function insertTextAtCursor(text) {
    var sel, range, html;
    if (window.getSelection) {
      sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        range = sel.getRangeAt(0);
        range.deleteContents();
        range.insertNode( document.createTextNode(text) );
      }
    } else if (document.selection && document.selection.createRange) {
      document.selection.createRange().text = text;
    }
  }

  // Loop all javascript code blocks
  [].forEach.call(document.querySelectorAll("pre.language-javascript code"), function(jsBlock) {

    // Make it editable
    jsBlock.contentEditable = true;
    jsBlock.spellcheck = false;

    // Store original code
    jsBlock.origcode = stripHTML(jsBlock.innerHTML);

    // On focus: set orig code fragment again
    // jsBlock.addEventListener('focus', function(e) {
    //   this.innerHTML = this.origcode;
    //   Prism.highlightElement(this);
    // });

    // Hook ctrl+enter / cmd+enter to run the code
    jsBlock.addEventListener('keydown', function(e) {

      // escape pressed
      if (e.keyCode == 27) {
        jsBlock.blur();
        return true;
      }

      // don't jump navigation
      e.stopPropagation();
      e.stopImmediatePropagation();

      // execute code
      if((e.ctrlKey || e.metaKey) && (e.keyCode == 13)) {
        e.preventDefault();

        try {
          // eval(stripHTML(this.innerHTML)));
          new Function(stripHTML(this.innerHTML))();
        } catch(e) {
          console.log('Exception: ' + e.message);
        }

        // re-highlight block
        Prism.highlightElement(jsBlock);

        // blur block, so we can move to next slide
        // jsBlock.blur();

      }
    }, false);

  });

  // when a slide activates, restore the original code
  deck.on("activate", function(e) {
    [].forEach.call(e.slide.querySelectorAll("pre.language-javascript code"), function(jsBlock) {
      jsBlock.innerHTML = jsBlock.origcode;
      Prism.highlightElement(jsBlock);
    });
  });
};


bespoke.from('article', {
  keys: true,
  touch: true,
  bullets: 'li, .bullet',
  scale: true,
  hash: true,
  progress: true,
  state: true,
  coderun: true
});

// (function preloadBackgroundImages() {

//   var matches, image,
//     forEach = function(arrayLike, fn) {
//       [].slice.call(arrayLike, 0).forEach(fn);
//     };

//   forEach(document.styleSheets, function(sheet) {
//     forEach(sheet.rules, function(rule) {
//       if (rule.style && rule.style.backgroundImage) {
//         matches = rule.style.backgroundImage.match(/url\((.*)\)/);
//         if (matches) {
//           image = new Image();
//           image.src = matches[1];
//         }
//       }
//     });
//   });

// }());
