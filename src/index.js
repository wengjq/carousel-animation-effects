import './styles.css';
import './animation.css';
import Carousel from './carousel.js';

let carouselContainer = document.getElementById('carousel-container');

new Carousel(carouselContainer, {
    'autoPlay': true, // 自动播放
    'currentIndex': 0, // 开始的帧数
    'speed': 1500, // 切换的速度
    'duration': 4000, // 停留的时间
    'dots': true,
    'arrows': true,
    'effectIndex': 13 // 切换的效果(1：淡入淡出,2：水平滑动,3：垂直滑动,4：水平翻转,5：垂直翻转,6：水平 3D 翻转,7：垂直 3D 翻转, 8: 淡入放大,9：水平魔方旋转,10：垂直魔方旋转,11： 聚焦,12：分区聚焦,13： 顺时针风车,14：逆时针风车)
});