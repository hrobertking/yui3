(function(){var G=YAHOO,C=G.util,F=C.Dom,B=G.lang,A=G.widget;function E(H,D){this.constructor.superclass.constructor.apply(this,arguments);}E.NAME="SliderThumb";E.X="X";E.Y="Y";E.CONFIG={"group":{},"minX":{value:0},"maxX":{value:0},"minY":{value:0},"maxY":{value:0},"tickSize":{validator:function(D){return(B.isNumber(D)&&D>=0);},value:0},"x":{set:function(D){return this.constrain(D,E.X);},value:0},"y":{set:function(D){return this.constrain(D,E.Y);},value:0},"locked":{value:false}};B.extend(E,A.Widget,{initializer:function(D){this.initProps();},initProps:function(){var D=this.getXRange();var H=this.getYRange();if(D!==0&&H!==0){this._isRegion=true;}else{if(D!==0){this._isHoriz=true;}else{this._isVert=true;}}},constrain:function(L,J){var I=this.get("min"+J);var D=this.get("max"+J);var H=this.get("tickSize");if(L<I){L=I;}else{if(L>D){L=D;}else{if(H>0){var K=L%H;if(K>0){if(K<Math.round(H/2)){L=L-K;}else{L=L+(H-K);}}}}}return L;},clearTicks:function(){this.set("tickSize",0);},lock:function(){this.set("locked",true);},unlock:function(){this.set("locked",false);},isLocked:function(){return this.get("locked");},getValue:function(){if(this._isHoriz){return this.getXValue();}else{if(this._isVert){return this.getYValue();}else{return[this.getXValue(),this.getYValue()];}}},getXValue:function(){return this.get("x");},getYValue:function(){return this.get("y");},getXRange:function(){return this.get("maxX")-this.get("minX");},getYRange:function(){return this.get("maxY")-this.get("minY");},getTickPause:function(){var I=this.get("tickSize");if(I>0){var D=(this._isHoriz)?this.getXRange():this.getYRange();var H=Math.round(D/I);if(H>0){return Math.round(360/H);}}return 0;},endMove:function(){this.parent.endMove();},_isHoriz:false,_isVert:false,_isRegion:false,_dd:null,renderer:function(){this.centerPoint=this.findCenter();this.initDD();this.apply();},initDD:function(){var H=this,I=this.getXScale(),J=this.getYScale();var D=new C.DD(this.getThumbEl().id,H.get("group"));D.setXConstraint(H.get("minX")*I,H.get("maxX")*I,H.get("tickSize")*I);D.setYConstraint(H.get("minY")*J,H.get("maxY")*J,H.get("tickSize")*J);D.isTarget=false;D.maintainOffset=true;D.scroll=false;this._dd=D;},getOffsetFromParent:function(M){var O=this.getThumbEl();var K;if(!this.deltaOffset){var D=F.getXY(O);M=M||F.getXY(this.getParentEl());K=[(D[0]-M[0]),(D[1]-M[1])];var I=parseInt(F.getStyle(O,"left"),10);var P=parseInt(F.getStyle(O,"top"),10);var L=I-K[0];var J=P-K[1];if(!isNaN(L)&&!isNaN(J)){this.deltaOffset=[L,J];}}else{var H=parseInt(F.getStyle(O,"left"),10);var N=parseInt(F.getStyle(O,"top"),10);K=[H+this.deltaOffset[0],N+this.deltaOffset[1]];}return K;},getUIValue:function(){if(this._isHoriz){return this.getUIXValue();}else{if(this._isVert){return this.getUIYValue();}else{return[this.getUIXValue(),this.getUIYValue()];}}},getUIXValue:function(){return Math.round(this.getOffsetFromParent()[0]/this.getXScale());},getUIYValue:function(){return Math.round(this.getOffsetFromParent()[1]/this.getYScale());},setXOffset:function(){this.moveThumb(this.getOffsetForX(),null,false,false);},setYOffset:function(){this.moveThumb(null,this.getOffsetForY(),false,false);},getXScale:function(){var D=this.getXRange();if(D>0){var H=this.getParentEl().offsetWidth-this.getThumbEl().offsetWidth;return Math.round(H/D);}else{return 0;}},getYScale:function(){var D=this.getYRange();if(D>0){var H=this.getParentEl().offsetHeight-this.getThumbEl().offsetHeight;return Math.round(H/D);}else{return 0;}},getOffsetForX:function(D){var I=this.getXValue()-this.get("minX");var J=I*this.getXScale()+this.centerPoint.x;var H=F.getXY(this.getParentEl())[0];return H+J;},getOffsetForY:function(J){var H=this.getYValue()-this.get("minY");var I=H*this.getYScale()+this.centerPoint.y;var D=F.getXY(this.getParentEl())[1];return D+I;},findCenter:function(){var D=this.getThumbEl();return{x:parseInt(D.offsetWidth/2,10),y:parseInt(D.offsetHeight/2,10)};},moveThumb:function(Q,P,N,M){var I=F.getXY(this.getThumbEl());if(!Q&&Q!==0){Q=I[0];}if(!P&&P!==0){P=I[1];}var O=this.centerPoint;this._dd.setDelta(O.x,O.y);var J=this._dd.getTargetCoord(Q,P);var L=[J.x,J.y];var H=this;var K=this.parent.get("animate");if(K&&this.get("tickSize")>0&&!N){this.lock();this.curCoord=I;setTimeout(function(){H.moveOneTick(L);},this.parent.get("tickPause"));}else{if(K&&!N){this.lock();var D=new C.Motion(this.get("node").get("id"),{points:{to:L}},this.get("animationDuration"),C.Easing.easeOut);D.onComplete.subscribe(function(){H.endMove();});D.animate();}else{this._dd.setDragElPos(Q,P);if(!M){this.endMove();}}}},moveOneTick:function(H){var J=null;if(this._isRegion){J=this._getNextX(this.curCoord,H);var D=(J)?J[0]:this.curCoord[0];J=this._getNextY([D,this.curCoord[1]],H);}else{if(this._isHoriz){J=this._getNextX(this.curCoord,H);}else{J=this._getNextY(this.curCoord,H);}}if(J){this.curCoord=J;this._dd.alignElWithMouse(this.getThumbEl(),J[0],J[1]);if(!(J[0]==H[0]&&J[1]==H[1])){var I=this;setTimeout(function(){I.moveOneTick(H);},this.parent.get("tickPause"));}else{this.endMove();}}else{this.endMove();}},_getNextX:function(D,H){var K;var I=[];var J=null;if(D[0]>H[0]){K=this.get("tickSize")-this.centerPoint.x;I=this._dd.getTargetCoord(D[0]-K,D[1]);J=[I.x,I.y];}else{if(D[0]<H[0]){K=this.get("tickSize")+this.centerPoint.x;I=this._dd.getTargetCoord(D[0]+K,D[1]);J=[I.x,I.y];}else{}}return J;},_getNextY:function(D,H){var K;var I=[];var J=null;if(D[1]>H[1]){K=this.get("tickSize")-this.centerPoint.y;I=this._dd.getTargetCoord(D[0],D[1]-K);J=[I.x,I.y];}else{if(D[1]<H[1]){K=this.get("tickSize")+this.centerPoint.y;I=this._dd.getTargetCoord(D[0],D[1]+K);J=[I.x,I.y];}else{}}return J;},getThumbEl:function(){return this.get("node").get("node");},getParentEl:function(){return this.parent.get("node").get("node");},centerPoint:null,curCoord:null,apply:function(){this.addViewListeners();},addViewListeners:function(){this.on("xChange",this.setXOffset,this,true);this.on("yChange",this.setYOffset,this,true);this.on("tickSize",this.onTickSizeChange,this,true);
this.on("lockedChange",this.onLockChange,this,true);},onTickSizeChange:function(){if(this.get("tickSize")===0){this._dd.clearTicks();}},onLockChange:function(){var D=this._dd;if(this.get("locked")){D.lock();}else{D.unlock();}}});A.SliderThumb=E;})();(function(){var I=YAHOO,C=I.util,G=C.Event,H=C.Dom,B=I.lang,A=I.widget;function F(E,D){this.constructor.superclass.constructor.apply(this,arguments);}F.INC=1;F.DEC=-1;F.getHorizSlider=function(J,E,D,M,L){var K=new A.SliderThumb(E,{group:J,minX:D,maxX:M,tickSize:L});return new F(J,{group:J,thumb:K,type:"horiz"});};F.getVertSlider=function(E,D,M,L,K){var J=new A.SliderThumb(D,{group:E,minY:M,maxY:L,tickSize:K});return new F(E,{group:E,thumb:J,type:"vert"});};F.getRegionSlider=function(J,E,D,N,O,M,L){var K=new A.SliderThumb(E,{group:J,minX:D,maxX:N,minY:O,maxY:M,tickSize:L});return new F(J,{group:J,thumb:K,type:"region"});};F.NAME="Slider";F.CONFIG={group:{},thumb:{},type:{value:"horiz",validator:function(D){return(D=="horiz"||D=="vert"||D=="region");}},bgEnabled:{value:true},keysEnabled:{value:true},keyIncrement:{value:20},tickPause:{value:40},animationDuration:{value:0.2},animate:{value:!B.isUndefined(C.Anim)},locked:{value:false}};B.extend(F,A.Widget,{initializer:function(D){if(this.get("group")){this.initThumb();}},initThumb:function(){var D=this.getThumb();D.parent=this;this.set("tickPause",D.getTickPause());},getThumb:function(){return this.get("thumb");},lock:function(){this.set("locked",true);},unlock:function(){this.set("locked",false);},isLocked:function(){return this.get("locked");},getValue:function(){return this.getThumb().getValue();},getXValue:function(){return this.getThumb().getXValue();},getYValue:function(){return this.getThumb().getYValue();},setValueToMin:function(){this._setValToLimit(false);},setValueToMax:function(){this._setValToLimit(true);},_setValToLimit:function(E){var L=(E)?"max":"min",J=this.getThumb(),K=A.SliderThumb,D=K.X,M=K.Y;if(J._isHoriz){this.setValue(J.get(L+D));}else{if(J._isVert){this.setValue(J.get(L+M));}else{this.setRegionValue(J.get(L+D),J.get(L+M));}}},setValue:function(K,J,D){if(this.isLocked()&&!J){return false;}if(isNaN(K)){return false;}var E=this.getThumb();if(E._isRegion){return false;}else{if(E._isHoriz){E.set("x",K,D);}else{if(E._isVert){E.set("y",K,D);}}}},setRegionValue:function(E,D,L,J){if(this.isLocked()&&!L){return false;}if(isNaN(E)&&isNaN(D)){return false;}var K=this.getThumb();if(E||E===0){K.set("x",E,J);}if(D||D===0){K.set("y",D,J);}},_slideStart:function(){if(!this._sliding){this.fireEvent("slideStart");this._sliding=true;}},_slideEnd:function(){if(this._sliding&&this.moveComplete){this.fireEvent("slideEnd");this._sliding=false;this.moveComplete=false;}},stepYValue:function(D){var J=this.get("keyIncrement")*D,E=this.getThumb();var K=this.getYValue()+J;if(E._isVert){this.setValue(K);}else{if(E._isRegion){this.setRegionValue(null,K);}}},stepXValue:function(D){var J=this.get("keyIncrement")*D,E=this.getThumb();var K=this.getXValue()+J;if(E._isHoriz){this.setValue(K);}else{if(E._isRegion){this.setRegionValue(K,null);}}},endMove:function(){this.unlock();this.moveComplete=true;this.fireEvent("endMove");this.fireEvents();},fireEvents:function(J){var E=this.getThumb();if(!J){this.cachePosition();}if(!this.isLocked()){if(E._isRegion){var L=E.getXValue();var K=E.getYValue();if(L!=this.previousX||K!=this.previousY){this.fireEvent("change",{x:L,y:K});}this.previousX=L;this.previousY=K;}else{var D=E.getValue();if(D!=this.previousVal){this.fireEvent("change",D);}this.previousVal=D;}this._slideEnd();}},focus:function(){this.focusEl();if(this.isLocked()){return false;}else{this._slideStart();return true;}},renderer:function(){this.baselinePos=H.getXY(this.getBackgroundEl());this.getThumb().render();this.initDD();this.apply();},update:function(){this.getThumb().update();},initDD:function(){this._dd=new C.DragDrop(this.get("node").get("id"),this.get("group"),true);this._dd.isTarget=false;},focusEl:function(){var D=this.getBackgroundEl();if(D.focus){try{D.focus();}catch(E){}}this.verifyOffset();},verifyOffset:function(E){var D=H.getXY(this.getBackgroundEl());if(D){if(D[0]!=this.baselinePos[0]||D[1]!=this.baselinePos[1]){this.getThumb()._dd.resetConstraints();this.baselinePos=D;return false;}}return true;},cachePosition:function(){this.getThumb()._dd.cachePosition();},getBackgroundEl:function(){return this.get("node").get("node");},apply:function(){this.addKeyListeners();this.addDDListeners();this.addThumbDDListeners();this.addViewListeners();},addKeyListeners:function(){var D=this.getBackgroundEl();G.on(D,"keydown",this.onKeyDown,this,true);G.on(D,"keypress",this.onKeyPress,this,true);},addDDListeners:function(){var E=this,D=this._dd;D.onMouseUp=function(J){E.onBGMouseUp(J);};D.b4MouseDown=function(J){E.beforeBGMouseDown(J);};D.onDrag=function(J){E.onBGDrag(J);};D.onMouseDown=function(J){E.onBGMouseDown(J);};this.on("endMove",this.sync,this,true);},addThumbDDListeners:function(){var E=this,D=this.getThumb()._dd;D.onMouseDown=function(J){E.onThumbMouseDown(J);};D.startDrag=function(J){E.onThumbStartDrag(J);};D.onDrag=function(J){E.onThumbDrag(J);};D.onMouseUp=function(J){E.onThumbMouseUp(J);};},addViewListeners:function(){this.on("lockedChange",this.onLockChange,this,true);},onLockChange:function(){var D=this._dd;var E=this.getThumb();if(this.get("locked")){D.lock();E.lock();}else{D.unlock();E.unlock();}},sync:function(){var D=this.getThumb().getUIValue();if(this.getThumb()._isRegion){this.setRegionValue(D[0],D[1],false,true);}else{this.setValue(D,false,true);}},beforeBGMouseDown:function(E){var D=this.getThumb()._dd;D.autoOffset();D.resetConstraints();},onBGMouseDown:function(D){if(!this.isLocked()&&this.get("bgEnabled")){this.focus();this._moveThumb(D);}},_moveThumb:function(E){var D=G.getPageX(E);var J=G.getPageY(E);this.getThumb().moveThumb(D,J);},onBGDrag:function(D){if(!this.isLocked()){this._moveThumb(D);}},onBGMouseUp:function(D){if(!this.isLocked()&&!this.moveComplete){}},onThumbMouseDown:function(D){return this.focus();
},onThumbStartDrag:function(D){this._slideStart();},onThumbDrag:function(D){this.sync();this.fireEvents(true);},onThumbMouseUp:function(D){if(!this.isLocked()&&!this.moveComplete){this.endMove();}},onKeyPress:function(D){if(this.get("keysEnabled")){switch(G.getCharCode(D)){case 37:case 38:case 39:case 40:case 36:case 35:G.preventDefault(D);break;default:}}},onKeyDown:function(E){var D=F;if(this.get("keysEnabled")){var J=true;switch(G.getCharCode(E)){case 37:this.stepXValue(D.DEC);break;case 38:this.stepYValue(D.DEC);break;case 39:this.stepXValue(D.INC);break;case 40:this.stepYValue(D.INC);break;case 36:this.setValueToMin();break;case 35:this.setValueToMax();break;default:J=false;}if(J){G.stopEvent(E);}}},_dd:null});A.Slider=F;})();YAHOO.register("slider",YAHOO.widget.Slider,{version:"@VERSION@",build:"@BUILD@"});