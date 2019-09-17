// This is a little hack to add some missing SQL keywords to rough lexer, so that they can be highlighted properly in code snippets

window.onload = function () {
    var spanTags = document.getElementsByTagName("span");
    var searchText = ["FOLLOWING", "PARTITION", "EXCLUDE", "ROWS", "RANGE", "GROUPS", "PRECEDING", "UNBOUNDED", "OVER", "TIES"];
    
    for (var i = 0; i < spanTags.length; i++) {
      for (var j = 0; j < searchText.length; j++) {
        if (spanTags[i].textContent == searchText[j]) { 
          spanTags[i].classList.add('k');
          spanTags[i].classList.remove('n');
        }
      }
    }    
}
