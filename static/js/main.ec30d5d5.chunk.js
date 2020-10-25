(this["webpackJsonpelection-visualizer"]=this["webpackJsonpelection-visualizer"]||[]).push([[0],{15:function(e,t,a){e.exports=a(25)},20:function(e,t,a){},22:function(e,t,a){},25:function(e,t,a){"use strict";a.r(t);var n,i=a(0),c=a.n(i),s=a(2),r=a.n(s),o=(a(20),a(1)),l=a(3),u=a.n(l),d=a(6),v=a(12),h=a(7),f=a.n(h),m=a(11),p=(a(22),a(8)),E=a(9),b=a(14),g=a(13);a(5);!function(e){e[e.active=0]="active",e[e.elected=1]="elected",e[e.eliminated=2]="eliminated"}(n||(n={}));var O=function(e,t){var a=Math.pow(10,t);return Math.round(e*a)/a},w=function(e){Object(b.a)(a,e);var t=Object(g.a)(a);function a(){return Object(p.a)(this,a),t.apply(this,arguments)}return Object(E.a)(a,[{key:"render",value:function(){var e=this.props.candidate;return c.a.createElement("div",{className:e.status===n.eliminated?"eliminated":e.status===n.elected?"elected":void 0},c.a.createElement("span",null,e.name),function(e){return e.status===n.eliminated?null:c.a.createElement("span",null,":\xa0",e.votesWhenElected?O(e.votesWhenElected,3):e.votesOnCurrentRound.map((function(e){return O(e,3)})).join(" "))}(e))}}]),a}(c.a.Component);function y(e){var t=e.ballot;return c.a.createElement("div",{className:"Ballot"},c.a.createElement("ul",null,t.votes.map((function(e){return c.a.createElement(c.a.Fragment,null,c.a.createElement("li",{key:e.candidateName,className:e.status===n.eliminated?"eliminated":e.status===n.elected?"elected":void 0},e.candidateName,1!==e.value?"(".concat(O(e.value,3),")"):""),c.a.createElement("br",null))}))))}var j=a(10),C=a.n(j);function N(e,t){var a=e.map((function(e){return Object(o.a)(Object(o.a)({},e),{},{votesOnCurrentRound:Array(3).fill(0)})}));return t.forEach((function(e){e.votes.reduce((function(e,t){return a.find((function(e){return e.name===t.candidateName}))?t.status===n.active&&e.push(t):console.error("Something went horribly wrong, trying to assing a vote to candidate ".concat(t.candidateName,", but it was not found on the candidate list")),e}),new Array).forEach((function(e,t){var n=a.find((function(t){return t.name===e.candidateName}));n?n.votesOnCurrentRound[t]+=e.value:console.error("Something went horribly wrong, trying to assing a vote to candidate ".concat(e.candidateName,", but it was not found on the candidate list"))}))})),a.sort((function(e,t){if(void 0!==e.positionWhenElected&&void 0!==t.positionWhenElected)return e.positionWhenElected-t.positionWhenElected;if(void 0!==e.positionWhenElected&&void 0===t.positionWhenElected)return-1;if(void 0===e.positionWhenElected&&void 0!==t.positionWhenElected)return 1;for(var a=0;a<e.votesOnCurrentRound.length;++a){var n=t.votesOnCurrentRound[a]-e.votesOnCurrentRound[a];if(0!==n)return n}return 0})),{newCandidates:a,newBallots:t}}var P=function(e,t){var a=Math.ceil(.25*t.length);console.log("Any candidate with ".concat(a," votes or more is automatically elected"));var i={phases:[],activePhase:0},c=N(e,t),s=c.newCandidates,r=c.newBallots;i.phases.push({candidates:s,ballots:r});for(var o=function(){console.log("Phase",i.phases.length,"starting");for(var e=C()(i.phases[i.phases.length-1]),t=!1,c=function(c){var s=e.candidates[c],r=s.votesOnCurrentRound[0];if(s.status!==n.elected&&r>=a){e.candidates[c].status=n.elected,e.candidates[c].votesWhenElected=r,e.candidates[c].positionWhenElected=c,t=!0,console.log("".concat(s.name," elected!"));var o=(r-a)/r;e.ballots.forEach((function(t){var a=!1,i=!1;t.votes.forEach((function(t){if(a&&!i){var c=e.candidates.find((function(e){return e.name===t.candidateName}));c&&c.status===n.active&&(t.value=o,i=!0)}t.candidateName===s.name&&(t.status=n.elected,a=!0)}))}));var l=N(e.candidates,e.ballots),u=l.newCandidates,d=l.newBallots;i.phases.push({candidates:u,ballots:d})}},s=0;s<e.candidates.length&&!t;++s)c(s);if(!t){!function(e){for(var t=null,a=e.candidates.length-1;a>=0;--a)if(e.candidates[a].status===n.active){t=e.candidates[a].name,e.candidates[a].status=n.eliminated;break}e.ballots.forEach((function(e){e.votes.forEach((function(e){e.candidateName===t&&(e.status=n.eliminated)}))}))}(e);var r=N(e.candidates,e.ballots),o=r.newCandidates,l=r.newBallots;i.phases.push({candidates:o,ballots:l})}};i.phases[i.phases.length-1].candidates.filter((function(e){return e.status===n.elected})).length<3;)o();return i};var W=function(){var e=Object(i.useState)({phases:[],activePhase:0}),t=Object(v.a)(e,2),a=t[0],s=t[1];return Object(i.useEffect)((function(){function e(){return(e=Object(d.a)(u.a.mark((function e(){var t,a,i,c,r,o,l,d;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("".concat("/election-visualizer","/data/Inaugural_Ballot.csv"));case 2:return t=e.sent,e.next=5,t.text();case 5:a=e.sent,i=f.a.parse(a),c=i.data[0].slice(1),r=c.map((function(e){var t=e.match(/\[(.*)\]/);return{name:t?t[1]:"",status:n.active,votesOnCurrentRound:Array(3).fill(0)}})),o=i.data.slice(1),l=o.map((function(e){var t=e.slice(1);return{votes:Array.from(Array(3).keys()).map((function(e){var a=t.findIndex((function(t){return t.includes(String(e+1))}));return{candidateName:r[a].name,status:n.active,value:1}}))}})),d=P(r,l),s(d);case 13:case"end":return e.stop()}}),e)})))).apply(this,arguments)}!function(){e.apply(this,arguments)}()}),[]),c.a.createElement("div",{className:"App"},c.a.createElement("div",null,a.phases[a.activePhase]&&c.a.createElement(m.a,null,a.phases[a.activePhase].candidates.map((function(e){return c.a.createElement(w,{key:e.name,candidate:e})})))),c.a.createElement("div",null,c.a.createElement("button",{onClick:function(){s(Object(o.a)(Object(o.a)({},a),{},{activePhase:Math.max(0,a.activePhase-1)}))},disabled:0===a.activePhase},"Previous phase"),c.a.createElement("button",{onClick:function(){s(Object(o.a)(Object(o.a)({},a),{},{activePhase:Math.min(a.phases.length-1,a.activePhase+1)}))},disabled:a.activePhase===a.phases.length-1},"Next phase")),c.a.createElement("div",null,a.phases[a.activePhase]&&a.phases[a.activePhase].ballots.map((function(e,t){return c.a.createElement(y,{key:t,ballot:e})}))))};r.a.render(c.a.createElement(c.a.StrictMode,null,c.a.createElement(W,null)),document.getElementById("root"))},5:function(e,t,a){}},[[15,1,2]]]);
//# sourceMappingURL=main.ec30d5d5.chunk.js.map