document.querySelectorAll('.intro > *, .project-copy > *, .project-stage, .capabilities > *, .about > *').forEach(el=>el.classList.add('reveal'));
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in');observer.unobserve(entry.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
const previewObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;const frame=entry.target;frame.src=frame.dataset.src;frame.removeAttribute('data-src');previewObserver.unobserve(frame)}),{rootMargin:'500px 0px'});
document.querySelectorAll('iframe[data-src]').forEach(frame=>previewObserver.observe(frame));
document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',()=>document.body.classList.remove('menu-open')));
