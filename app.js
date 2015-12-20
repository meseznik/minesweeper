window.onload = function(){
  var containerEl = document.getElementById('mine_sweeper');
  var minesweeper = new Minesweeper(containerEl, 10, 30, 50);
  minesweeper.init();
}

function Minesweeper(containerEl, fieldX, fieldY, minesTotalAmount) {
  var tilesArr = [];
  var self = this;

  this.init  = function() {
    this.createArray();
    this.populateMines();
    this.createElements();
    this.addEventListeners(); 
  }

  this.createArray = function() {
    for (var i = 0; i < fieldX; i++) {
      tilesArr[i] = [];
        for (var j = 0; j < fieldY; j++) {
          tilesArr[i][j] = null;
        }
    }
  }

  this.populateMines = function() {
    var minesPopulated = 0;
    // not very efficient, use knuth shuffle
    while(minesPopulated < minesTotalAmount) {
      var randX = (fieldX-1) * Math.random() << 0;
      var randY = (fieldY-1) * Math.random() << 0;

      if(tilesArr[randX][randY] !== 'mine') {
        tilesArr[randX][randY] = 'mine';
        minesPopulated++;
      }
    }
  }

  this.createElements = function() {
    for (var i = 0; i < fieldX; i++) {
      var fieldRow = document.createElement('div');
      fieldRow.className = 'field_row';
        for (var j = 0; j < fieldY; j++) {
          var fieldTile = document.createElement('div');  
          fieldTile.setAttribute('data-xy', i + ',' + j);
          fieldTile.className = 'field_tile';
          fieldRow.appendChild(fieldTile);
        }
     containerEl.appendChild(fieldRow); 
    }
  }

  this.addEventListeners = function() {
    var classname = document.getElementsByClassName("field_tile");
    for(var i=0;i<classname.length;i++){
        classname[i].addEventListener('click', self.tileClick, false);
    }
  }

  this.getMinesAroundTile  = function(tileX, tileY) {
    var mines = 0;

    for (var i = -1; i <= 1; i++) {
      var tempX = parseInt(tileX) + i;
      if(tempX >= 0 && tempX < fieldX) {
        
        for (var j = -1; j <= 1; j++) {
          var tempY = parseInt(tileY) + j;

          if(tempY >= 0 && tempY < fieldY) {
            var tileVal = tilesArr[tempX][tempY];

            if(tileVal === 'mine'){
              mines++;
            }
          }          
        } 
      }
    }
    
    return mines;
  }


  this.tileClick = function(event){
    var el = event.target;
    var tileX = el.getAttribute('data-xy').split(',')[0];
    var tileY = el.getAttribute('data-xy').split(',')[1];

    var minesAround = self.getMinesAroundTile(tileX,tileY);

    if(tilesArr[tileX][tileY] === 'mine') { 
      self.gameOver(tileX,tileY);
    } else if(minesAround > 0) {
      self.revealTile(el,minesAround);
    } else {
      self.revealAdjacentTiles(tileX,tileY);
    }

  }
  
  this.revealAdjacentTiles = function(tileX,tileY) {

    for (var i = -1; i <= 1; i++) {
      var tempX = parseInt(tileX) + i;

      if(tempX >= 0 && tempX < fieldX) {
        for (var j = -1; j <= 1; j++) {
          var tempY = parseInt(tileY) + j;

          if(tempY >= 0 && tempY < fieldY) {
            if(tilesArr[tempX][tempY] !== 'mine' && tilesArr[tempX][tempY] !== 'checked'){
              var minesAround = self.getMinesAroundTile(tempX,tempY);
              var el = document.querySelector("[data-xy='" + tempX + "," + tempY + "'");
                tilesArr[tempX][tempY] = 'checked';
              if(minesAround){
                self.revealTile(el,minesAround);
              } else {
                self.revealTile(el,0);
                self.revealAdjacentTiles(tempX,tempY);
              }
            }
          }          
        } 
      }
    }

  }

  this.gameOver = function(tileY,tileY) {
    for (var i = 0; i < fieldX; i++) {
      for (var j = 0; j < fieldY; j++) {
        var tileVal = tilesArr[i][j];
        if(tileVal === 'mine'){
          var el = document.querySelector("[data-xy='" + i + "," + j + "'");
          self.revealTile(el,null,true);
        }
      }
    }
    // mark current mine tile 
    // notify user
    // reset game
  }
  
  this.reset = function() {

  }

  this.revealTile = function(el,minesAround,isMine) {
    var mines = minesAround || '';
    el.innerHTML = mines;
    el.className = 'field_tile revealed';
    if(isMine){
      el.className = 'field_tile mine';
    }
  }

}