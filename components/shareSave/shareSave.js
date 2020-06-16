var WxParse = require('../../wxParse/wxParse.js');
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        canvasWidth: {
            type: String,
            value: '',
        },
        canvasHeight: {
            type: String,
            value: '',
        },
        shareUrl: {
            type: String,
            value: '',
        },//商品图片
        year: {
            type: String,
            value: '',
        },
        moth: {
            type: String,
            value: '',
        },
        day: {
            type: String,
            value: '',
        },
        title: {
            type: String,
            value: '',
        },
        shareContent: {
            type: String,
            value: '',
        },
        qrcode: {
            type: String,
            value: '',
        },
        shareLabel: {
            type: String,
            value: '',
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        // canvasWidth:'375'
        // 弹窗显示控制
        isShow: false,
        // year: '2019',//年份
        // moth: 'Jul',//月份
        // day: '03',//日期
        // shareUrl: '/assets/images/code.png',
        // title: '西式牛排套餐西式牛排套餐西式牛排套餐',//
        // shareContent: '菲力牛排、肉眼牛排、西冷牛排（沙朗牛排）、T骨牛排……这些名称都是英语翻译来的',
        // qrcode: '/assets/images/code.png',
        // shareLabel: ['#标签1', '#标签2', '#标签3']

    },
    attached: function () {
        // let that = this
        
    },
    /**
     * 组件的方法列表
     */
    methods: {
        //隐藏弹框
        hideShare() {
            this.setData({
                isShow: !this.data.isShow
            })
        },
        //展示弹框
        showShare() {
            this.setData({
                isShow: !this.data.isShow
            })
            this.drawCanvas()
        },

        // 关闭
        closeAlertTap(){
            this.setData({
                isShow:false
            })
        },

        // 圆角画弧
        roundRect: function (ctx, x, y, w, h, r) {
            // 开始绘制
            ctx.beginPath()
            // 因为边缘描边存在锯齿，最好指定使用 transparent 填充
            // 绘制左上角圆弧
            // ctx.arc(-1,-1,20, Math.PI, Math.PI * 1.5)
            ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)

            // 绘制border-top
            ctx.moveTo(x + r, y)
            ctx.lineTo(x + w - r, y)
            ctx.lineTo(x + w, y + r)
            // 绘制右上角圆弧
            ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)

            // 绘制border-right
            ctx.lineTo(x + w, y + h - r)
            ctx.lineTo(x + w - r, y + h)
            // 绘制右下角圆弧
            ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)

            // 绘制border-bottom
            ctx.lineTo(x + r, y + h)
            ctx.lineTo(x, y + h - r)
            // 绘制左下角圆弧
            ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)

            // 绘制border-left
            ctx.lineTo(x, y + r)
            ctx.lineTo(x + r, y)

            ctx.fillStyle = "#fff";
            ctx.fill()
            // 剪切
            ctx.clip()
        },
        //填充内容

        //画布
        drawCanvas: function () {
            let that = this
            const ctx = wx.createCanvasContext('myCanvas', this)
            let Rpx = this.data.canvasWidth / 375

            // //画布生成柱状图
            // const ctx = wx.createContext()
            // // const ctx = wx.createCanvasContext('myCanvas')
            // //背景
            this.drawMain(ctx, Rpx, that)

            // wx.drawCanvas({
            //     canvasId: 'myCanvas',
            //     actions: ctx.getActions()
            // })
        },

        //填充内容
        drawMain: function (ctx, Rpx, that) {
            let _this = this

            // 绘制背景色
            // ctx.beginPath();
            // ctx.setFillStyle('#fff')
            // ctx.fillRect(0, 0, 620, 980)


            this.roundRect(ctx, 0, 0, 310 * Rpx, 490 * Rpx, 6 * Rpx)
            this.setData({
                // canvasWidth: 327 * Rpx,
                // canvasHeight: 776 * Rpx
            })
            // console.log(ctx, Rpx, that)
            /**
             * 40 * Rpx     至美推荐宽度
             * 60 * Rpx     至美推荐高度
             */
            // ctx.drawImage(that.data.tagUrl, 19 * Rpx, 0, 40 * Rpx, 60 * Rpx);

            // 填充文案
            ctx.beginPath();
            ctx.fillStyle = "#333333";
            ctx.font = "20px 400";
            ctx.setFontSize(14 * Rpx)
            ctx.fillText('精选推荐', 15 * Rpx, 30 * Rpx);
            ctx.fill();


            // 绘制线条
            ctx.beginPath();
            ctx.moveTo(15, 40);//开始坐标
            ctx.lineTo(70, 40);//途经坐标
            ctx.strokeStyle = "#E7C778"
            ctx.lineWidth = 2
            ctx.stroke()

            // 日期
            ctx.beginPath();
            ctx.fillStyle = "#777777";
            ctx.font = "20px 400";
            ctx.setFontSize(12 * Rpx)
            ctx.fillText(that.data.year, 255 * Rpx, 30 * Rpx)
            ctx.fill();

            ctx.beginPath();
            ctx.fillStyle = "#777777";
            ctx.font = "20px 400";
            ctx.setFontSize(12 * Rpx)
            ctx.fillText(that.data.moth, 250 * Rpx, 45 * Rpx);
            ctx.fill();

            ctx.beginPath();
            ctx.fillStyle = "#777777";
            ctx.font = "20px 400";
            ctx.setFontSize(12 * Rpx)
            ctx.fillText(that.data.day, 268 * Rpx, 45 * Rpx);
            ctx.fill();

            // 竖线
            ctx.beginPath();
            ctx.moveTo(290 * Rpx, 20 * Rpx);
            ctx.lineTo(290 * Rpx, 48 * Rpx);
            ctx.strokeStyle = "#E7C778";
            ctx.lineWidth = 2
            ctx.stroke()

            // 商品图片
            /*
            context.drawImage(img,x,y);
            context.drawImage(img,x,y,width,height);
            context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
            img	规定要使用的图像、画布或视频。
            sx	可选。开始剪切的 x 坐标位置。
            sy	可选。开始剪切的 y 坐标位置。
            swidth	可选。被剪切图像的宽度。
            sheight	可选。被剪切图像的高度。
            x	在画布上放置图像的 x 坐标位置。
            y	在画布上放置图像的 y 坐标位置。
            width	可选。要使用的图像的宽度（伸展或缩小图像）。
            height	可选。要使用的图像的高度（伸展或缩小图像）。
            */
            // '/assets/images/code.png'     that.data.shareUrl
            // wx.downloadFile({
            //     src: that.data.shareUrl,//服务器返回的图片地址
            //     success: function (res) {
            //         console.log(that.data.shareUrl, 'that.data.shareUrl', res)
                    //res.path是网络图片的本地地址
                    // let path = res.tempFilePath;
            ctx.drawImage(that.data.shareUrl, 55 * Rpx, 60 * Rpx, 200 * Rpx, 200 * Rpx);
            //     }
            // })


            // 绘制线条
            ctx.beginPath();
            ctx.drawImage('/assets/images/line.png', 15 * Rpx, 305 * Rpx, 280 * Rpx, 9 * Rpx);

            ctx.beginPath();
            ctx.fillStyle = "#333333";
            ctx.font = "20px 400";
            ctx.setFontSize(16 * Rpx)
            _this.drawText(ctx, Rpx, that.data.title, 15 * Rpx, 342 * Rpx, 235 * Rpx)
            ctx.fill();

            // 标签
            ctx.beginPath();
            ctx.fillStyle = "#777777";
            ctx.font = "20px 400";
            ctx.setFontSize(12 * Rpx)
            // console.log(that.data.shareLabel,'that.data.shareLabel')
            if (that.data.shareLabel.length>=1){
                if (typeof (that.data.shareLabel) == 'string'){
                    that.data.shareLabel = that.data.shareLabel.split(',')
                }
                // ctx.fillText(that.data.shareLabel, 20 * Rpx, 280 * Rpx);
                var labelMar = 15;
                that.data.shareLabel.map((item, Index) => {
                    var measureText = Math.ceil(ctx.measureText(item).width);//获取当前文案的宽度 向上取整
                    // console.log(measureText, 'measureText', Index, (Index * 2.5), (Index + 1) + (Index * 2.5) * 15 * Rpx)
                    // _this.drawText(ctx, Rpx, item, ((Index + 1) + (Index * 2.5)) * 15 * Rpx, 367 * Rpx, measureText * Rpx)
                    _this.drawText(ctx, Rpx, item, labelMar, 367 * Rpx, measureText * Rpx)
                    labelMar = measureText + labelMar+15
                })
            }
            ctx.fill();

            // 内容文本
            ctx.beginPath();
            ctx.fillStyle = "#777777";
            // ctx.font = "normal bold 20px sans-serif";
            ctx.font = "20px 400";
            ctx.setFontSize(12 * Rpx)
            
            that.data.shareContent = that.data.shareContent!=''?that.data.shareContent.substr(0,65)+'...':'';
            _this.drawText(ctx, Rpx, that.data.shareContent, 15 * Rpx, 400 * Rpx, 200 * Rpx)
            ctx.fill();

            // // 二维码
            ctx.drawImage(that.data.qrcode, 240 * Rpx, 400 * Rpx, 60 * Rpx, 60 * Rpx);
            ctx.draw()
        },
        //自动换行  文本内容
        drawText: function (ctx, Rpx, t, x, y, w) {
            var chr = t.split("");
            var temp = "";
            var row = [];

            // ctx.font = "light 12px Arial";
            // ctx.fillStyle = "#343434";
            // ctx.textBaseline = "middle";
            // ctx.setFontSize(11 * Rpx)

            for (var a = 0; a < chr.length; a++) {
                if (ctx.measureText(temp).width < w) {
                    ;
                } else {
                    row.push(temp);
                    temp = "";
                }
                temp += chr[a];
            }

            row.push(temp);

            for (var b = 0; b < row.length; b++) {
                ctx.fillText(row[b], x, y + (b + 1) * 15);
            }
            ctx.fill();

        },

        //保存图片到手机
        saveImage: function () {
            let that = this

            // this.triggerEvent("saveImageTap")
            // 获取画布的总长（一个柱状图的高 * 柱状图的个数）
            // let height = this.data.canvasHeight * 1.70
            // // let height = this.data.canvasHeight * 2
            // let width = this.data.canvasWidth * 1.95


            // let height = this.data.canvasHeight * 1.48
            // let width = this.data.canvasWidth * 1.50
            // let height = 990
            // let width = 630

            let height = 980
            let width = 620
            console.log(height, "height", width, 'width')
            //画布转为图片
            wx.canvasToTempFilePath({
                x: 0,
                y: 0,
                width: width,
                height: height,
                destWidth: width,
                destHeight: height,
                quality: 1,
                canvasId: 'myCanvas',
                success: function (res) {
                    // console.log(res.tempFilePath, this)
                    // 保存到系统相册 获取授权
                    wx.saveImageToPhotosAlbum({
                        filePath: res.tempFilePath,
                        success: function () {
                            that.setData({
                                isShow: false
                            })
                            wx.showToast({
                                title: '保存成功',
                                icon: 'none'
                            })
                        }
                    })
                },
            }, this)

        },
    }
})
