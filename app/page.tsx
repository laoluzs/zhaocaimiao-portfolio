'use client';
import { useEffect, useRef, useState } from 'react';
const projects=[
 {id:'01',slug:'kids',title:'儿童乐园',en:'KIDS PLAYGROUND',desc:'明快色彩与趣味装置构建儿童主题直播场景',images:['01.png','02.png','03.png','04.png','05.png','06.png']},
 {id:'02',slug:'water',title:'夏日户外玩水',en:'SUMMER WATER FUN',desc:'用清凉蓝调与户外氛围呈现夏季活动视觉',images:['01.png','02.png','03.png','04.png','05.png','06.png']},
 {id:'03',slug:'yellow',title:'黄色主题',en:'YELLOW CAMPAIGN',desc:'高饱和黄色系统贯穿空间、主图与延展物料',images:['01.png','02.png','03.png','04.png','05.png','06.png']}
];
function ProjectSlider({project}:{project:typeof projects[number]}){
 const [active,setActive]=useState(0);const startX=useRef(0);const didSwipe=useRef(false);const total=project.images.length;
 const go=(n:number)=>setActive((n+total)%total);
 return <article id={`case-${project.slug}`} className="project-slider" aria-label={`${project.title}案例轮播`}>
  <header className="project-head"><div><small>{project.id} / 03</small><h3>{project.title}</h3><span>{project.en}</span></div><p>{project.desc}</p><div className="project-count"><b>{String(active+1).padStart(2,'0')}</b><i>/</i><span>{String(total).padStart(2,'0')}</span></div></header>
  <div className="slider-viewport book-viewport" role="button" tabIndex={0} aria-label="点击翻到下一张" onClick={()=>{if(!didSwipe.current)go(active+1);didSwipe.current=false}} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();go(active+1)}}} onTouchStart={e=>{startX.current=e.touches[0].clientX;didSwipe.current=false}} onTouchEnd={e=>{const d=e.changedTouches[0].clientX-startX.current;if(Math.abs(d)>45){didSwipe.current=true;go(active+(d<0?1:-1))}}}>
   <div className="slider-track book-track">{project.images.map((img,i)=><figure key={img} className={i===active?"active":i<active?"before":"after"} aria-hidden={i!==active}><img src={`/projects/${project.slug}/${img}`} alt={`${project.title}视效图 ${i+1}`} loading={i<2?"eager":"lazy"}/><figcaption><span>{String(i+1).padStart(2,"0")}</span><small>VISUAL DESIGN / 2026</small></figcaption></figure>)}</div>
   <button className="slider-arrow prev" onClick={e=>{e.stopPropagation();go(active-1)}} aria-label="上一张">←</button><button className="slider-arrow next" onClick={e=>{e.stopPropagation();go(active+1)}} aria-label="下一张">→</button>
  </div>
  <div className="slider-nav"><div className="progress-tabs">{project.images.map((_,i)=><button key={i} className={i===active?'active':''} onClick={()=>setActive(i)} aria-label={`跳转到第 ${i+1} 张`}><i/><span>{String(i+1).padStart(2,'0')}</span></button>)}</div><span>拖动 / 点击快速定位</span></div>
 </article>
}
export default function Home(){
 useEffect(()=>{const move=(e:MouseEvent)=>{document.documentElement.style.setProperty('--mx',`${(e.clientX/innerWidth-.5)*18}px`);document.documentElement.style.setProperty('--my',`${(e.clientY/innerHeight-.5)*14}px`)};addEventListener('mousemove',move);return()=>removeEventListener('mousemove',move)},[]);
 return <main>
  <header className="nav"><a className="brand" href="#top"><b>招财猫</b><small>LUCKY CAT DESIGN</small></a><nav><a href="#work">作品</a><a href="#about">关于</a><a href="#contact">联系</a></nav><small>PORTFOLIO / 2026</small></header>
  <section className="hero hero-v2" id="top">
   <div className="copy"><label>用设计赋能直播 · 让视觉驱动转化　✦</label><h1>直播间设计<br/>视觉全案专家</h1><i className="signature">Zhaocaimiao</i><p>专注直播间视觉策略与场景打造<br/>从设计到落地，助力品牌提升转化与停留</p><div><a className="btn" href="#work">查看案例　→</a><a className="service-btn" href="#about">了解服务</a></div><div className="hero-stats"><span><b>60+</b>直播间设计</span><span><b>18+</b>品牌合作</span><span><b>100+</b>项目落地</span><span><b>5年+</b>行业经验</span></div></div>
   <div className="orbit"><i/><i/><i/></div>
   <div className="hero-person"><div className="video-sequence"><video className="hero-video" autoPlay muted loop playsInline preload="metadata" poster="/hero-frame-6.png" aria-label="招财猫女性视觉设计师动态展示"><source src="/hero-character.mp4" type="video/mp4"/></video></div><span className="name-tag">招财设计喵　✿</span><div className="video-status"><i/><span>PLAYING</span></div></div>
   <div className="float-cards"><a className="float-card c1" href="#case-kids"><small>01</small><b>儿童乐园</b><em>KIDS PLAYGROUND</em><span>KIDS</span></a><a className="float-card c2" href="#case-water"><small>02</small><b>夏日户外玩水</b><em>SUMMER WATER FUN</em><span>WATER</span></a><a className="float-card c3" href="#case-yellow"><small>03</small><b>黄色主题</b><em>YELLOW CAMPAIGN</em><span>YELLOW</span></a></div>
   <aside className="process"><span>◎<b>视觉策略</b><small>STRATEGY</small></span><i/><span>◇<b>全案落地</b><small>IMPLEMENTATION</small></span><i/><span>↗<b>高效转化</b><small>CONVERSION</small></span></aside>
   <div className="skillbar"><span>▣<small>直播间设计</small></span><span>▧<small>主图设计</small></span><span>▤<small>KT板设计</small></span><span>▥<small>详情页设计</small></span><span>◇<small>3D场景设计</small></span><span>▷<small>视频脚本</small></span></div>
  </section>
  <section className="statement" id="about"><p>不只装饰一个空间，<br/>而是设计一场<span>让品牌被记住</span>的直播。</p><div className="stats"><div><b>60<sup>+</sup></b><small>落地直播间</small></div><div><b>18</b><small>合作品牌</small></div><div><b>06</b><small>服务品类</small></div></div></section>
  <section className="work work-v2" id="work"><header><div><small>SELECTED WORK</small><h2>精选案例</h2></div><p>三个主体视觉项目，每组均可独立滑动浏览。</p></header><div className="project-list">{projects.map(project=><ProjectSlider key={project.slug} project={project}/>)}</div></section>
  <section className="services"><div><small>SERVICE SCOPE</small><h2>从直播间出发，<br/>向每一个触点延展。</h2></div><ol><li><b>01</b><span>直播间视觉设计</span><em>场景 / 贴片 / 氛围 / 导播视觉</em></li><li><b>02</b><span>电商主图设计</span><em>产品主图 / 详情页 / 活动页</em></li><li><b>03</b><span>品牌物料延展</span><em>KT板 / 海报 / 展架 / 包装</em></li><li><b>04</b><span>视觉策略与统筹</span><em>风格定位 / 视觉规范 / 长期服务</em></li></ol></section>
  <footer className="contact" id="contact"><h2>有一个直播间，<br/>想让它<span>不一样？</span></h2><a href="mailto:hello@fortunecat.design">开始合作　↗</a><div><span>招财猫视觉设计</span><span>WECHAT · REDBOOK · EMAIL</span><span>© 2026</span></div></footer>
 </main>
}