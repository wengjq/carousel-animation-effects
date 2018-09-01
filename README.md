# carousel-animation-effects
一个轮播动画特效的库

### Usage
```js
<div id="carousel-container" class="carousel-container">
    <div id="carousel-wrap" class="carousel-wrap">
        <div class="carousel-item">
            <div class="carousel-img-1 carousel-img"></div>
        </div>
        <div class="carousel-item">
            <div class="carousel-img-2 carousel-img"></div>
        </div>
        <div class="carousel-item">
            <div class="carousel-img-3 carousel-img"></div>
        </div>
        <div class="carousel-item">
            <div class="carousel-img-4 carousel-img"></div>
        </div>
    </div>
</div>

let carouselInstance = new Carousel(document.getElementById('carousel-container'), {
  autoPlay: true, // 自动播放
  currentIndex: 0, // 开始的帧数
  speed: 1500, // 切换的速度
  duration: 4000, // 停留的时间
  dots: true, // 是否开启圆点切换
  arrows: true, // 是否开启箭头切换
  effectIndex: 1, // 切换的效果
  // 1：淡入淡出, 2：水平滑动, 3：垂直滑动, 4：水平翻转,
  // 5：垂直翻转, 6：水平 3D 翻转, 7：垂直 3D 翻转, 8: 淡入放大,
  // 9：水平魔方旋转, 10：垂直魔方旋转, 11：聚焦, 12：分区聚焦,
  // 13：顺时针风车, 14：逆时针风车
});
```

## API

### props

<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th style="width: 100px;">name</th>
        <th style="width: 50px;">type</th>
        <th style="width: 50px;">default</th>
        <th>description</th>
    </tr>
    </thead>
    <tbody>
        <tr>
          <td>autoPlay</td>
          <td>Boolean</td>
          <td>false</td>
          <td>automatic carousel</td>
        </tr>
        <tr>
          <td>currentIndex</td>
          <td>Number</td>
          <td>0</td>
          <td>initialize the position of the carousel</td>
        </tr>
         <tr>
          <td>speed</td>
          <td>Number</td>
          <td>1500</td>
          <td>animation speed</td>
        </tr>
        <tr>
          <td>duration</td>
          <td>Number</td>
          <td>4000</td>
          <td>automatic carousel interval</td>
        </tr>
        <tr>
          <td>dots</td>
          <td>Boolean</td>
          <td>true</td>
          <td>open dots switch</td>
        </tr>   
        <tr>
          <td>dotsClass</td>
          <td>String</td>
          <td>'carousel-dots'</td>
          <td>customize dot class</td>
        </tr>
        <tr>
          <td>arrows</td>
          <td>Boolean</td>
          <td>true</td>
          <td>open arrows switch</td>
        </tr>   
        <tr>
          <td>nextArrow</td>
          <td>String</td>
          <td>'<button></button>'</td>
          <td>customize the node of nextArrow</td>
        </tr>     
        <tr>
          <td>prevArrow</td>
          <td>String</td>
          <td>'<button></button>'</td>
          <td>customize the node of prevArrow</td>
        </tr> 
        <tr>
          <td>effectIndex</td>
          <td>Number</td>
          <td>0</td>
          <td>switch effect</td>
        </tr>                                 
    </tbody>
</table>

## Development

```
npm install
npm run start
```

## License

carousel-animation-effects is released under the MIT license.