var eventBus = new Vue()

Vue.component('product',{
  template:`
  <div class="product">
    <div class="product-image">
        <img :src="image" />
    </div>
    <div class="product-info">
        <h1>{{title}}</h1>
        <p v-if="inStock" class="stockColor">In stock</p>
        <p v-else class="stockColor" :style="{color: color}" :class="{outOfStock:!inStock}">Out of stock</p>
        <p>Shipping- {{shipping}}</p>
        <ul>
            <li v-for="detail in details">{{detail}}</li>
        </ul>
        <h4>{{productdetails}}</h4>
        <div v-for="(varient, index) in varients" :key="index"
        class="color-box" :style="{backgroundColor: varient.varientColor}"
        @mouseover="updateproduct(index)">
            <!-- <p @mouseover="updateproduct(varient.variantImage, varient.stock)">{{varient.varientColor}}</p> -->
            <br>
        </div>
        <button class="btn-add" @click="addToCart" :disable="!inStock" :class="{disabledButton: !inStock}">Add to Cart</button>
        <button class="btn-remove" @click="removeToCart" :disable="cart.length==0" :class="{disabledButton: cart.length==0}">Remove</button>
        
    </div>

    <product-tabs class="product-tabs" :reviews="reviews"></product-tabs>
    <Cart-list></Cart-list>

  </div>
  `,
  props:{
    primium:{},
    productdetails:{},
    cart: {},
  },
  data(){
    return{
      brand: 'Vue',
      product: 'Socks',
      color: 'red',
      selector: 0,
      details: ['80% Cotton', '20% Polyester', 'Gender- Neutral'],
      varients:[
        {
          varientId: 10,
          varientColor: 'Green',
          variantImage: 'https://www.vuemastery.com/images/challenges/vmSocks-green-onWhite.jpg',
          stock: 5,
        },
        {
          varientId: 20,
          varientColor: 'Blue',
          variantImage: 'https://www.vuemastery.com/images/challenges/vmSocks-blue-onWhite.jpg',
          stock: 2,
        }
      ],
      reviews: [],
    }
  },
  methods:{
    addToCart(){
      this.$emit('cartupdate', this.varients[this.selector].varientId)
    },
    removeToCart(){
      this.$emit('removecart', this.varients[this.selector].varientId)
    },
    updateproduct(index){
      this.selector = index;
      console.log(this.selector)
    },
    // addReview(productReview){
    //   this.reviews.push(productReview)
    // }
  },
  computed:{
    title(){
      return this.brand+' '+this.product
    },
    image(){
      return this.varients[this.selector].variantImage
    },
    inStock(){
      return this.varients[this.selector].stock
    },
    shipping(){
      if(this.primium){
        return "Free"
      }
      else{
        return "2.99 USD"
      }
    }, 
  },
  mounted(){
    eventBus.$on('gotit', productReview=>{
      console.log(productReview)
      this.reviews.push(productReview)
    })
  }
})
Vue.component('productreviews',{
  template:`
  <form class="review-form" @submit.prevent="onSubmit">
    <p class="error" v-if="errors.length">
      <b>Please correct the following error(s):</b>
      <ul>
        <li v-for="error in errors">{{ error }}</li>
      </ul>
    </p>

    <p>
      <label for="name">Name:</label>
      <input id="name" v-model="name">
    </p>
    
    <p>
      <label for="review">Review:</label>      
      <textarea id="review" v-model="review"></textarea>
    </p>
    
    <p>
      <label for="rating">Rating:</label>
      <select id="rating" v-model.number="rating">
        <option>5</option>
        <option>4</option>
        <option>3</option>
        <option>2</option>
        <option>1</option>
      </select>
    </p>
    <p>Would you recommend this product?</p>
        <label>
          Yes
          <input type="radio" value="Yes" v-model="recommend"/>
        </label>
        <label>
          No
          <input type="radio" value="No" v-model="recommend"/>
        </label>
    <p>
      <input type="submit" value="Submit">  
    </p>
</form>
`,
  data(){
    return{
      name: null,
      review: null,
      rating: null,
      recommend: null,
      errors: []
    }
  },
  methods:{
    onSubmit(){
      this.errors = []
      if(this.name && this.review && this.rating && this.recommend) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
          recommend: this.recommend
        }
        console.log(productReview)
        eventBus.$emit('gotit', productReview)
        this.name = null
        this.review = null
        this.rating = null
        this.recommend = null
      } else {
        if(!this.name) this.errors.push("Name required.")
        if(!this.review) this.errors.push("Review required.")
        if(!this.rating) this.errors.push("Rating required.")
        if(!this.recommend) this.errors.push("Recommendation required.")
      }
    }
  }
})
Vue.component('product-tabs',{
  props:{
    reviews: {
      type: Array,
      required: false
    }
  },
  template:`
    <div>
      <span class="tab" :class="{activeTab: selectedTab === tab}"
      v-for="(tab, index) in tabs" :key="index"
      @click="selectedTab = tab">{{tab}}</span>


      <div class="review" v-show="selectedTab === 'Reviews'">
      <h2>Reviews</h2>
      <p v-if="!reviews.length">No Review yet.</p>
      <ul v-else>
          <li v-for="(review, index) in reviews" :key="index">
              <p>Name: {{ review.name }}</p>
              <p>Rating:{{ review.rating }}</p>
              <p>Review: {{ review.review }}</p>
              <p>Recommend: {{ review.recommend }}</p>
          </li>
        </ul>
      </div>
      <productreviews v-show="selectedTab === 'Make a Review'"></productreviews>
    </div>

  `,
  data(){
    return{
      tabs:['Reviews', 'Make a Review'],
      selectedTab: 'Reviews'
    }
  }
})

Vue.component('Cart-list',{
  props:{
    // reviews: {
    //   type: Array,
    //   required: false
    // }
  },
  template:`
    <div class="mr-new">
      <header>
        <h1>Cart List</h1>
      </header>
      <section id="user-goal">
        <p :class="{red: carts.length == 0}" v-if="(carts.length == 0)">
          No goals have been added yet - please start adding some!
        </p>
        <ul v-else>
          <li v-for="(cart, index) in carts" :key="index">
            {{cart}}
          </li>
        </ul>
      </section>
    </div>

  `,
  data(){
    return{
      carts:['Reviews', 'Make a Review'],
    }
  }
})


var app = new Vue({
  el: '#app',
  data:{
    primium: true,
    productdetails:'Comfortable Socks',
    cart: [],
  },
  methods:{
    updateCart(id){
      this.cart.push(id);
      console.log(this.cart)
    },
    removeCart(id){
      let index = this.cart.indexOf(id)
      if(this.cart.length!=0 ){
        this.cart.splice(index,1)
      }
      console.log(this.cart)
    }
  }
})

