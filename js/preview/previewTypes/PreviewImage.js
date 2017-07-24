/*global variables Inherit, Preview, $PreviewHandler, Actions, $Tree, $Utils, $EventHandler*/
loadOnce("../Preview");
loadOnce("/$Utils");
loadOnce("/$EventHandler");
loadOnce("/serverCommunication");
$PreviewHandler.registerPreviewType(
	class PreviewImage extends Preview{
		__initVars(){
			super.__initVars();
			this.extensions = ["png","jpg","jpeg"];
			this.hasImgLoaded = false;
			this.template = {
				html:`  <div class=image>
			                <img src=''>
			            </div>
			            <div class=info>
			                <div class=size>
			                    <div class=field>
			                        <div class=fieldName>Size:</div>
			                        <div class=fieldValue>500x600</div>
			                    </div>
			                </div>
			                <div class=ratio>
			                    <div class=field>
			                        <div class=fieldName>Aspect Ratio:</div>
			                        <div class=fieldValue>16:9</div>
			                    </div>
			                </div>
			            </div>`,
		        style:` .image{
		                    height: calc(100% - 20px);
		                    width: 100%;
		                }
		                img{
		                    position:relative;
		                    top:50%;
		                    left:50%;
		                    transform:translate(-50%,-50%);
		                    image-rendering: pixelated;
		                }
		                
		                .info{
		                    font-size: 15px;
		                    height:20px;
		                    width:100%;
		                }
		                .info>div{
		                    width: calc(50% - 2px);
		                    display:inline-block;
		                    height: 100%;
		                }
		                .field{
		                    display:inline-block;
		                    height: 100%;
		                    
		                    position: relative;
		                    left: 50%;
		                    transform: translate(-50%, 0);
		                }
		                .fieldName{
		                    display: inline-block;
		                }
		                .fieldValue{
		                    display: inline-block;
		                    padding-left: 10px;
		                }`	
			};
		}
		__resetImg(){
	        var img = this.$("img");
	        img.attr("src", `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXN
	        				SR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZ
	        				nR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAA1JREFUGFdj+P//PwMACPwC/ohfBuAAAAA
	        				ASUVORK5CYII=`);
	        this.hasImgLoaded = false;
	        img.width("100%").height("100%");
	    }
	    __onLoadFile(file){
	        super.__onLoadFile(file);
	        
	        var img = this.$("img");
	        var t = this;
			$Utils.fitImageInDiv(img, file.getPath(), 20, function(orWidth, orHeight){
			    t.$(".size .fieldValue").text(orWidth+"x"+orHeight);
			    
			    //http://stackoverflow.com/a/29624344/3080469
			    var primes = [];
	            for(var n=3;n<=100;n+=2) {
	                if(primes.every(function(prime){return n%prime!=0})) {
	                    primes.push(n);
	                }
	            }
	            primes.unshift(2);
	            
	            var aspectWidth = orWidth;
	            var aspectHeight = orHeight;
	            loop:
	            while(true){
	                outer:{
	                    for(var i=0; i<primes.length; i++){
	                        var prime = primes[i];
	                        if((aspectWidth/prime)%1==0 &&
	                            (aspectHeight/prime)%1==0){
	                            aspectWidth = aspectWidth/prime;
	                            aspectHeight = aspectHeight/prime;
	                            break outer;
	                        }
	                    }
	                    break loop;
	                }
	            }
			    t.$(".ratio .fieldValue").text(aspectWidth+":"+aspectHeight);
			});
	    }
	    
	    close(){
	        if($EventHandler.trigger("close:pre", this, {file:this.file})){
	            $EventHandler.disableEvents();
	            if(super.close()){
	                this.__resetImg();
	                this.file = null;
	                
	                $EventHandler.enableEvents();
	                $EventHandler.trigger("close:post", this, {file:this.file});
	                return true;
	            }
	        }
	        return false;
	    }
	}
);