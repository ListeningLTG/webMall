<template>
  <div>
    <nav-header></nav-header> 
    <nav-bread>
      <span>Goods</span>
    </nav-bread>
<div class="accessory-result-page accessory-page">
  <div class="container">
    <div class="filter-nav">
      <span class="sortby">Sort by:</span>
      <a href="javascript:void(0)" class="default cur">Default</a>
      <a href="javascript:void(0)" class="price" @click="sortGoods">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
      <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
    </div>
    <div class="accessory-result">
      <!-- filter -->
      <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
        <dl class="filter-price">
          <dt>Price:</dt>
          <dd><a href="javascript:void(0)" v-bind:class="{'cur':priceChecked=='all'}" @click="priceCheckedAll">All</a></dd>
          <dd v-for="(price, index) in priceFilter" :key="index">
            <a href="javascript:void(0)" v-bind:class="{'cur':priceChecked==index}" @click="setPriceFilter(index)">{{price.startPrice}} - {{price.endPrice}}</a>
          </dd>
        </dl>
      </div>

      <!-- search result accessories list -->
      <div class="accessory-list-wrap">
        <div class="accessory-list col-4">
          <ul>
            <li v-for="(item,index) in goodsList" :key="index">
              <div class="pic">
                <a href="#"><img v-lazy="'/static/'+item.productImage" :key="'/static/'+item.productImage" alt=""></a>
              </div>
              <div class="main">
                <div class="name">{{item.productName}}</div>
                <div class="price">{{item.salePrice}}</div>
                <div class="btn-area">
                  <a href="javascript:;" class="btn btn--m">加入购物车</a>
                </div>
              </div>
            </li>
          </ul>
          <div class="loadMore" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
              <img src="./../../static/loading-svg/loading-spinning-bubbles.svg" alt="" v-show="loading">
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  <div class="md-overlay" v-show="overLayFlag" @click="closePop"> </div>
    <nav-footer></nav-footer>
  </div>
</template>

<style>
.accessory-list-wrap ul::after{
  clear: both;
  contain: '';
  height: 0;
  display: block;
  visibility: hidden;
}
.loadMore{
  height: 100px;
  line-height: 100px;
  text-align: center;
}
</style>

<script>
import "./../assets/css/base.css";
import "./../assets/css/product.css";

import NavHeader from "@/components/NavHeader.vue";
import NavFooter from "@/components/NavFooter.vue";
import NavBread from "@/components/NavBread.vue";

import axios from "axios";

export default {
  components: {
    NavHeader,
    NavFooter,
    NavBread
  },
  props: {},
  data() {
    return {
      goodsList: [],
      sortFlag: true,
      page: 1,
      pageSize: 8,
      busy:true,
      loading:false,
      priceFilter: [
        {
          startPrice: "0.00",
          endPrice: "500.00"
        },
        {
          startPrice: "500.00",
          endPrice: "1000.00"
        },
        {
          startPrice: "1000.00",
          endPrice: "5000.00"
        }
      ],
      priceChecked: "all",
      filterBy: false,
      overLayFlag: false
    };
  },
  watch: {},
  computed: {},
  methods: {
    getGoodsList(flag) {
      var param = {
        page: this.page,
        pageSize: this.pageSize,
        sort: this.sortFlag ? 1 : -1,
        priceLever:this.priceChecked
      };
      this.loading=true
      axios
        .get("/goods", {
          params: param
        })
        .then(res => {
          var resu = res.data;
          this.loading=false;
          if (resu.status == "0") {
            if (flag) {
              this.goodsList=this.goodsList.concat(resu.result.list)

              if (resu.result.count<8) {
                this.busy=true
              } else {
                this.busy=false
              }
            } else {
              this.goodsList = resu.result.list;
              this.busy=false
            }
            //this.goodsList = resu.result.list;
          } else {
            this.goodsList = [];
          }
        });
    },
    priceCheckedAll() {
      this.priceChecked = "all";
      this.closePop();
    },
    setPriceFilter(index) {
      this.priceChecked = index;
      this.closePop();
      this.page=1;
      this.getGoodsList();
    },
    showFilterPop() {
      (this.filterBy = true), (this.overLayFlag = true);
    },
    closePop() {
      (this.filterBy = false), (this.overLayFlag = false);
    },
    sortGoods() {
      this.sortFlag = !this.sortFlag;
      this.page = 1;
      this.getGoodsList();
    },
    loadMore(){
      this.busy=true;
      setTimeout(() => {
      this.page++;
      this.getGoodsList(true);
      }, 500);
    }
  },
  created() {},
  mounted() {
    this.getGoodsList();
  }
};
</script>
