function RandomBingImage(){
    let SELF={};
    SELF.randomItem=function(array){
        return array[Math.floor(Math.random()*array.length)];
    };
    /**
     * Bing每日图片的API
     */
    SELF.bingImagesAPIURL="https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=10";
    SELF.getBingImages=async function(){
        let corsServers=[
            /* "https://jsonp.afeld.me/?url=",
             * "https://api.allorigins.win/raw?url=", */
            "https://salty-earth-46109.herokuapp.com/",
            "https://eerovil-cors-proxy.herokuapp.com/",
            "https://lazyguy-nhl-proxy.herokuapp.com/",
            "https://cors-anywhere.herokuapp.com/"
        ];
        let headers=new window.Headers();
        headers.set("Origin","origin");
        let response=await window.fetch(SELF.randomItem(corsServers)+SELF.bingImagesAPIURL,{headers:headers});
        return await response.json();
    };
    SELF.randomBingImage=async function(){
        let localStorageKey="bingImages";
        let bingImages=JSON.parse(window.localStorage.getItem(localStorageKey));
        if(bingImages===null){bingImages={};}
        if((bingImages.data===undefined)||((new Date().getTime()-bingImages.update)>24*60*60*1000)){
            bingImages.data=await SELF.getBingImages();
            if(bingImages.data){
                bingImages.update=new Date().getTime();
                window.localStorage.setItem(localStorageKey,JSON.stringify(bingImages));
            }
        }
        function getImgCreate(options){
            let img=document.createElement("img");
            Object.assign(img,options);
            return img;
        }
        return getImgCreate({"src":new window.URL(SELF.randomItem(bingImages.data.images).url,SELF.bingImagesAPIURL).href,"data":bingImages.data});
    };
    /**
     * 在当前DOM的后面添加img网页元素
     */
    SELF.randomBingImageAfterDOMElement=async function(element){
        let img=await SELF.randomBingImage();
        element.after(img);
    };
    SELF.randomBingImageBeforeDOMElement=async function(element){
        let img=await SELF.randomBingImage();
        element.before(img);
    };
    SELF.randomBingImageAppendToDOMElement=async function(element){
        let img=await SELF.randomBingImage();
        element.appendChild(img);
    };
    return SELF;
}
