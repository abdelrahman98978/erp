import{u as g,r as t,j as a}from"./index-ClVfcCAl.js";const x=({onSelectCompany:n})=>{const{currentLanguage:s,t:e}=g(),o=t.useRef(null);return t.useEffect(()=>{const i=r=>{const l=(r.clientX/window.innerWidth-.5)*12,d=(r.clientY/window.innerHeight-.5)*12;document.querySelectorAll(".landing-bg-img").forEach(c=>{c.style.transform=`translate(${l}px, ${d}px) scale(1.12)`})};return window.addEventListener("mousemove",i),()=>window.removeEventListener("mousemove",i)},[]),a.jsxs("main",{style:{height:"100vh",width:"100vw",overflow:"hidden",background:"#181c1c",fontFamily:"Tajawal, Cairo, sans-serif",direction:s.dir,margin:0,padding:0,position:"relative"},children:[a.jsx("style",{children:`
        .geometric-grid-landing {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          grid-template-rows: repeat(12, 1fr);
          height: 100vh;
          width: 100vw;
          gap: 0;
          background: #181c1c;
        }

        .nav-card-landing {
          position: relative;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.5s ease, box-shadow 0.5s ease, border-color 0.5s ease;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 2.5rem;
          z-index: 1;
          text-decoration: none;
          border: 0.5px solid rgba(255, 255, 255, 0.08);
          cursor: pointer;
          user-select: none;
        }

        /* Subtle Shine Overlay Effect */
        .nav-card-landing::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.12) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: skewX(-25deg);
          transition: left 0.75s ease;
          z-index: 2;
          pointer-events: none;
        }

        .nav-card-landing:hover::before {
          left: 150%;
        }

        .card-topaz { grid-area: 1 / 1 / 13 / 5; }
        .card-ruwad { grid-area: 1 / 5 / 7 / 10; }
        .card-saffir { grid-area: 1 / 10 / 5 / 13; }
        .card-masi { grid-area: 5 / 10 / 9 / 13; }
        .card-ayal { grid-area: 9 / 5 / 13 / 13; }
        .card-extra { grid-area: 7 / 5 / 9 / 10; }

        @media (max-width: 1024px) {
          .geometric-grid-landing {
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: auto;
            overflow-y: auto;
            height: auto;
            min-height: 100vh;
          }
          .nav-card-landing {
            grid-area: auto !important;
            padding: 1.5rem;
            min-height: 240px;
          }
        }

        /* Smooth Micro-Animation on Card Hover */
        .nav-card-landing:hover {
          z-index: 20;
          transform: translateY(-4px) scale(1.015);
          filter: brightness(1.12);
          box-shadow: 0 20px 40px rgba(0, 81, 84, 0.35);
          border-color: rgba(212, 175, 55, 0.4);
        }

        .landing-bg-img {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transition: transform 1.5s ease, opacity 0.5s ease;
          z-index: -1;
        }

        .nav-card-landing:hover .landing-bg-img {
          transform: scale(1.14);
          opacity: 0.7;
        }

        .material-symbols-outlined {
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), color 0.3s ease;
        }

        .nav-card-landing:hover .material-symbols-outlined {
          transform: scale(1.15) translateY(-2px);
          color: #D4AF37 !important;
        }

        .overlay-landing {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.25) 60%, transparent 100%);
          z-index: 0;
        }

        .card-content-landing {
          position: relative;
          z-index: 10;
          transition: transform 0.5s ease;
        }

        .nav-card-landing:hover .card-content-landing {
          transform: translateY(-2px);
        }

        .card-stagger-landing {
          opacity: 0;
          animation: wallFadeIn 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes wallFadeIn {
          from {
            opacity: 0;
            transform: translateY(24px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes logoPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .brand-logo-animated {
          animation: logoPulse 4s infinite ease-in-out;
        }
      `}),a.jsxs("div",{style:{position:"absolute",top:"24px",left:"50%",transform:"translateX(-50%)",zIndex:50,display:"flex",alignItems:"center",gap:"12px",background:"rgba(24, 28, 28, 0.85)",backdropFilter:"blur(16px)",padding:"10px 28px",borderRadius:"9999px",border:"1px solid rgba(255, 255, 255, 0.12)",boxShadow:"0 10px 30px rgba(0,0,0,0.6)"},children:[a.jsx("img",{src:"/logo.png",alt:"ALSALIM GROUP LOGO",className:"brand-logo-animated",style:{width:"32px",height:"32px",borderRadius:"50%",border:"2px solid #D4AF37",background:"#FFFFFF",padding:"2px"}}),a.jsx("span",{style:{fontFamily:"Cairo, sans-serif",color:"#FFFFFF",fontSize:"15px",fontWeight:"800"},children:e("companyTitle","مجموعة خالد السليم للاستقدام والتشغيل | MAJMOAT ALKHALID ALSALIM")})]}),a.jsxs("div",{ref:o,className:"geometric-grid-landing",children:[a.jsxs("div",{className:"nav-card-landing card-topaz card-stagger-landing",onClick:()=>n("topaz"),style:{animationDelay:"0.1s",background:"#0f6b6e"},children:[a.jsx("div",{className:"landing-bg-img",style:{opacity:.45,backgroundImage:"url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80')"}}),a.jsx("div",{className:"overlay-landing"}),a.jsxs("div",{className:"card-content-landing",children:[a.jsx("span",{className:"material-symbols-outlined",style:{fontSize:"64px",marginBottom:"24px",display:"block",color:"rgba(255, 255, 255, 0.9)"},children:"diamond"}),a.jsx("h2",{style:{fontFamily:"Cairo, sans-serif",fontSize:"36px",fontWeight:"800",margin:"0 0 12px 0",color:"#FFFFFF"},children:e("companyTopazTitle","شركة توباز")}),a.jsx("p",{style:{color:"rgba(255, 255, 255, 0.75)",fontSize:"17px",maxWidth:"300px",margin:0,lineHeight:"1.6"},children:e("companyTopazSub","التميز في الحلول المتكاملة والابتكار الصناعي المستقبلي.")})]}),a.jsx("div",{style:{position:"absolute",top:"40px",left:"40px",color:"rgba(255, 255, 255, 0.12)",fontSize:"96px",fontFamily:"Cairo, sans-serif",fontWeight:"900",userSelect:"none"},children:"01"})]}),a.jsxs("div",{className:"nav-card-landing card-ruwad card-stagger-landing",onClick:()=>n("ruwad"),style:{animationDelay:"0.2s",background:"#005154"},children:[a.jsx("div",{className:"landing-bg-img",style:{opacity:.35,backgroundImage:"url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80')"}}),a.jsx("div",{className:"overlay-landing"}),a.jsxs("div",{className:"card-content-landing",children:[a.jsx("span",{className:"material-symbols-outlined",style:{fontSize:"48px",marginBottom:"16px",display:"block",color:"#FFFFFF"},children:"architecture"}),a.jsx("h2",{style:{fontFamily:"Cairo, sans-serif",fontSize:"32px",fontWeight:"800",margin:"0 0 8px 0",color:"#FFFFFF"},children:e("companyRuwadTitle","دار الرواد")}),a.jsx("p",{style:{color:"rgba(255, 255, 255, 0.8)",fontSize:"16px",margin:0},children:e("companyRuwadSub","الريادة في التطوير العقاري والاستثمار النوعي.")})]})]}),a.jsxs("div",{className:"nav-card-landing card-saffir card-stagger-landing",onClick:()=>n("saffir"),style:{animationDelay:"0.3s",background:"#535f74",textAlign:"center",alignItems:"center",justifyContent:"center"},children:[a.jsx("div",{className:"overlay-landing",style:{opacity:.4}}),a.jsxs("div",{className:"card-content-landing",style:{display:"flex",flexDirection:"column",alignItems:"center"},children:[a.jsx("span",{className:"material-symbols-outlined",style:{fontSize:"48px",marginBottom:"16px",color:"#FFFFFF"},children:"handshake"}),a.jsx("h2",{style:{fontFamily:"Cairo, sans-serif",fontSize:"26px",fontWeight:"700",margin:0,color:"#FFFFFF"},children:e("companySaffirTitle","السفير")}),a.jsx("div",{style:{marginTop:"12px",height:"4px",width:"32px",background:"rgba(255, 255, 255, 0.5)",borderRadius:"9999px"}})]})]}),a.jsxs("div",{className:"nav-card-landing card-masi card-stagger-landing",onClick:()=>n("masi"),style:{animationDelay:"0.4s",background:"#181c1c",border:"1px solid rgba(255, 255, 255, 0.1)",alignItems:"center",justifyContent:"center"},children:[a.jsx("div",{className:"landing-bg-img",style:{opacity:.08,backgroundImage:"url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80')"}}),a.jsxs("div",{className:"card-content-landing",style:{display:"flex",flexDirection:"column",alignItems:"center"},children:[a.jsx("span",{className:"material-symbols-outlined",style:{fontSize:"40px",marginBottom:"8px",color:"#0f6b6e"},children:"token"}),a.jsx("h2",{style:{fontFamily:"Cairo, sans-serif",fontSize:"24px",fontWeight:"700",color:"#FFFFFF",margin:0},children:e("companyMasiTitle","الماسي")}),a.jsx("p",{style:{fontSize:"11px",letterSpacing:"2px",textTransform:"uppercase",marginTop:"8px",opacity:.4,color:"#FFFFFF"},children:"Luxury Services"})]})]}),a.jsxs("div",{className:"nav-card-landing card-ayal card-stagger-landing",onClick:()=>n("ayal"),style:{animationDelay:"0.5s",background:"#6f3b18"},children:[a.jsx("div",{className:"landing-bg-img",style:{opacity:.55,backgroundImage:"url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80')"}}),a.jsx("div",{className:"overlay-landing"}),a.jsxs("div",{className:"card-content-landing",style:{display:"flex",flexDirection:"row",alignItems:"center",gap:"32px"},children:[a.jsx("div",{style:{background:"rgba(255, 255, 255, 0.15)",backdropFilter:"blur(12px)",padding:"20px",borderRadius:"20px",display:"flex",alignItems:"center",justifyContent:"center"},children:a.jsx("span",{className:"material-symbols-outlined",style:{fontSize:"40px",color:"#FFFFFF"},children:"flight_takeoff"})}),a.jsxs("div",{children:[a.jsx("h2",{style:{fontFamily:"Cairo, sans-serif",fontSize:"32px",fontWeight:"800",margin:"0 0 6px 0",color:"#FFFFFF"},children:e("companyAyalTitle","الأيال للسفر والسياحة")}),a.jsx("p",{style:{color:"rgba(255, 255, 255, 0.75)",fontSize:"16px",margin:0},children:e("companyAyalSub","بوابتك لاستكشاف العالم برفاهية وراحة تامة.")})]})]})]}),a.jsxs("div",{className:"nav-card-landing card-extra card-stagger-landing",style:{animationDelay:"0.6s",background:"rgba(15, 107, 110, 0.2)",display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center",gap:"16px"},children:[a.jsx("div",{style:{width:"48px",height:"1px",background:"rgba(255, 255, 255, 0.2)"}}),a.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"10px"},children:[a.jsx("img",{src:"/logo.png",alt:"ALSALIM GROUP LOGO",className:"brand-logo-animated",style:{width:"32px",height:"32px",borderRadius:"50%",border:"1.5px solid #D4AF37",background:"#FFFFFF",padding:"2px"}}),a.jsx("span",{style:{fontFamily:"Cairo, sans-serif",color:"#FFFFFF",fontWeight:"800",fontSize:"15px"},children:e("companyTitle","مجموعة خالد السليم للاستقدام والتشغيل | MAJMOAT ALKHALID ALSALIM")})]}),a.jsx("div",{style:{width:"48px",height:"1px",background:"rgba(255, 255, 255, 0.2)"}})]})]})]})};export{x as LandingPage};
