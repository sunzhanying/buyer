
const common = require("../../../assets/js/common.js");
const config = require('../../../utils/config.js');
Page({
    data: {
        doBrand: false, //是否为品牌查询
        courseList: [], // 课程列表
        pageAll: 1, //总页数
        pageNum: 1, //第几页
        size: 10, //每页条数
        noCourse: true, //无记录
        pop: false, // 子分类是否显示
        scrollTab: [], //头部标签
        nextTab: [{
                name: '全部分类',
                child: []
            },
            {
                name: '全部属性',
                child: []
            },
            {
                name: '智能排序',
                child: [
                    { name: '智能排序', id: '' },
                    { name: '热度',id:'1' },
                    { name: '上架时间', id: '2' }
                    ]
            }
        ], //分类
        tabChildIndex: -1, //当前选择一级分类下表
        labelId: '', //当前选择标签id，
        sortid: '', //智能排序    null 不排序 1:热度 2:上架时间   
        typeId: '', //素材类型id
        searchValue: '', //当前搜索的内容

        pagesAll: 1, //总页数
        pageNum: 1, //第几页
        pageSize: 10, //每页多少条数据

        isRefresh:false,//详情是否更改  是否需要刷新

    },

    // 详情跳转
    navDetail:function(e){
        wx.navigateTo({
            url: '/pages/home/recipeDetail/recipeDetail?id=' + e.currentTarget.dataset.id
        })
    },

    // 获取所有 菜品 属性   筛选
    getMeterialAttrAll:function(){
        var that = this;
        var nextTab = "nextTab[1].child"
        goodsService.getMeterialAttrAll().then(res=>{
            if(res.data.code == 200){
                var data = res.data.data;
                var list = [{ name: '全部属性', id: '' }]
                data.map(item=>{
                    var obj = { name: item, id: item}
                    list.push(obj)
                })
                that.setData({
                    [nextTab]: list
                })
            }else{
                common.showToast(res.data.message)
            }
        })
    },

    // 获取所有 菜品 类型   筛选
    getMeterialTypeAll: function () {
        var that = this;
        var nextTab = "nextTab[0].child"
        goodsService.getMeterialTypeAll().then(res => {
            if (res.data.code == 200) {
                var data = res.data.data;
                var list = [{ name: "全部分类", pId: "", id: "" }]
                data.map(item => {
                    list.push(item)
                })
                that.setData({
                    [nextTab]: list
                })
            } else {
                common.showToast(res.data.message)
            }
        })
    },
    // 点击弹出框隐藏
    closePop:function(){
        this.setData({
            pop: false,
            tabChildIndex: -1
        })
    },
    // 模糊搜索
    changeInput: function(e) {
        console.info(e);
        this.data.searchValue = e.detail.value;
        this.setData({
            courseList: [], //清空列表
        })
        this.getMeterialAll();
    },
    // 一级分类点击事件
    tabClick(e) {
        var that = this;
        const index = e.currentTarget.dataset.id;
        if (that.data.tabChildIndex != index){
            var pop = true;
            var tabChildIndex = index;
        }else{
            var pop = false;
            var tabChildIndex = -1;
        }
        this.setData({
            pop: pop,
            tabChildIndex: tabChildIndex
        })
    },
    // 二级分类点击事件
    childChoose(e) {
        console.info(e);
        const that = this;
        // 二级分类下标
        const idx = e.currentTarget.dataset.index;
        const id = e.currentTarget.dataset.id;
        // 当前选择一级分类下标
        const _tabChildIndex = that.data.tabChildIndex;
        let _item = that.data.nextTab[_tabChildIndex];

        var labelId = that.data.labelId, //当前选择标签id，
            sortid = that.data.sortid, //智能排序    null 不排序 1:热度 2:上架时间   
            typeId = that.data.typeId; //素材类型id
        _item.child = _item.child.map(function(item, index, arr) {
            item.chooce = false;
            if (index == idx) {
                item.chooce = true;
                // 根据当前选择一级分类下标判断
                switch (_tabChildIndex) {
                    case 0:
                        //分类 
                            _item.name = item.name;
                            _item.chooce = true;
                            labelId = e.currentTarget.dataset.id;
                        break;
                    case 1:
                        // 全部属性
                        _item.name = item.name;
                            _item.chooce = true;
                        typeId = e.currentTarget.dataset.id;
                        break;
                    case 2:
                        // 排序
                        _item.name = item.name;
                            _item.chooce = true;
                        sortid = e.currentTarget.dataset.id;
                        break;
                }
            }
            return item;
        })
        let _tabIndex = 'nextTab[' + _tabChildIndex + ']';
        this.setData({
            pop: false,
            [_tabIndex]: _item,
            labelId: labelId,
            sortid: sortid,
            typeId: typeId,
            courseList: [], //清空列表
        });
        // 
        that.getMeterialAll();
    },

    // 获取菜品列表
    getMeterialAll: function () {
        var that = this;
        var formData = {
            attributeName: that.data.typeId ,//     属性名称 单图 图集 视频
            page: that.data.pageNum,//               当前页
            size: that.data.pageSize,//             每页多少条
            sortid: that.data.sortid,//             排序 null 不排序 1: 热度 2: 上架时间
            typeid: that.data.labelId,//        素材类型id
            name:that.data.searchValue
        }
        wx.showLoading({
            title: '加载中~'
        })
        goodsService.getMeterialAll(formData).then(res => {
            // console.log(res, '获取菜品列表');
            if (res.data.code == 200) {
                wx.hideLoading()
                if (res.data.data.total>0){
                    var dataList = that.data.courseList;
                    res.data.data.list.map((item, index) => {
                        item.coverImg = item.coverImg ? config.NODOMAIN + item.coverImg : '';
                        dataList.push(item);
                    })
                    that.setData({
                        courseList: dataList,
                        pagesAll: res.data.data.pages, //总页数
                        pageNum: res.data.data.pageNum, //第几页
                        noCourse: true
                    })
                } else {
                    that.setData({
                        noCourse: false
                    })
                }
            } else {
                common.showToast(res.data.message)
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getMeterialAttrAll();//属性
        this.getMeterialTypeAll()//类型
        this.getMeterialAll()//列表
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        var that = this;
        if (that.data.isRefresh) {
            that.setData({
                pageAll: 1, //总页数
                pageNum: 1, //第几页
                courseList: []
            })
            that.getMeterialAll()
        }

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        var that = this;
        var pagesAll = that.data.pagesAll;
        var pageNum = that.data.pageNum;
        if (pageNum < pagesAll) {
            pageNum++;
            that.setData({
                pageNum: pageNum
            })
            that.getMeterialAll();

        }
    },
})