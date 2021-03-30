(this["webpackJsonpelection-visualizer"]=this["webpackJsonpelection-visualizer"]||[]).push([[0],{10:function(e,t,n){},19:function(e,t,n){e.exports=n(29)},24:function(e,t,n){},26:function(e,t,n){},29:function(e,t,n){"use strict";n.r(t);var a,c=n(0),r=n.n(c),i=n(1),o=n.n(i),l=(n(24),n(4)),s=n.n(l),d=n(18),u=n(11),m=n(3),v=n(15),f=n.n(v);n(26),n(10);!function(e){e[e.active=0]="active",e[e.elected=1]="elected",e[e.eliminated=2]="eliminated"}(a||(a={}));var h=function(e,t){var n=Math.pow(10,t);return Math.round(e*n)/n},p=function(e){return Array.from(Array(e).keys())};function E(e){var t=e.ballot;return r.a.createElement("div",{className:"Ballot"},r.a.createElement("ul",null,t.votes.map((function(e){return r.a.createElement(r.a.Fragment,null,r.a.createElement("li",{key:e.candidateName,className:"".concat(e.status===a.eliminated?"eliminated":e.status===a.elected?"elected":void 0," animated")},e.candidateName,1!==e.value?"(".concat(h(e.value,3),")"):""),r.a.createElement("br",null))}))))}var b=n(6),g=n(7),O=n(9),y=n(8),w=n(16),N=function(e){Object(O.a)(n,e);var t=Object(y.a)(n);function n(){return Object(b.a)(this,n),t.apply(this,arguments)}return Object(g.a)(n,[{key:"render",value:function(){var e=this.props,t=e.candidate,n=e.expanded,c=t.votesOnLastStage?t.votesOnLastStage:t.votesOnCurrentRound;return n||(c=c.slice(0,1)),r.a.createElement("tr",{key:t.name,className:"".concat(t.status===a.eliminated?"eliminated":t.status===a.elected?"elected":void 0," animated")},r.a.createElement("td",null,t.name),c.map((function(e,t){return r.a.createElement("td",{key:t},h(e,3))})),n&&r.a.createElement("td",{key:"total"},c.reduce((function(e,t){return e+t}),0)))}}]),n}(r.a.Component),x=[{fileName:"Spring_2021.csv",date:new Date("2021-04-01")},{fileName:"Inaugural_Ballot.csv",date:new Date("2020-10-01")}],j=function(e){Object(O.a)(n,e);var t=Object(y.a)(n);function n(e){var a;return Object(b.a)(this,n),(a=t.call(this,e)).state={expanded:!1},a}return Object(g.a)(n,[{key:"render",value:function(){var e=this,t=this.props.candidates,n=this.state.expanded,a=p(3);return n||(a=a.slice(0,1)),r.a.createElement("div",{className:"candidateTableWrapper"},r.a.createElement("table",{className:"candidateTable"},r.a.createElement(w.a,null,r.a.createElement("tr",null,r.a.createElement("th",null,"Candidate"),a.map((function(e){return r.a.createElement("th",{key:e},"Rank ".concat(e+1," votes"))})),n&&r.a.createElement("th",null,"Total")),t.map((function(t){return r.a.createElement(N,{key:t.name,candidate:t,expanded:e.state.expanded})})))),r.a.createElement("button",{className:"expandButton",onClick:function(){return e.setState({expanded:!e.state.expanded})}},this.state.expanded?"<":"..."))}}]),n}(r.a.Component);function k(e){var t=e.election,n=Object(c.useState)(0),a=Object(m.a)(n,2),i=a[0],o=a[1];var l=t.phases[i];return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",null,l&&r.a.createElement(j,{candidates:l.candidates})),r.a.createElement("div",{className:"info"},l&&l.info),r.a.createElement("div",null,r.a.createElement("button",{onClick:function(){o(Math.max(0,i-1))},disabled:0===i},"Previous phase"),r.a.createElement("button",{onClick:function(){o(Math.min(t.phases.length-1,i+1))},disabled:i===t.phases.length-1},"Next phase")),r.a.createElement("div",null,t.phases[i]&&t.phases[i].ballots.map((function(e,t){return r.a.createElement(E,{key:t,ballot:e})}))))}var C=n(13),S=n(17),A=n.n(S);function R(e,t){var n=e.map((function(e){return Object(C.a)(Object(C.a)({},e),{},{votesOnCurrentRound:Array(3).fill(0)})}));return t.forEach((function(e){e.votes.reduce((function(e,t){return n.find((function(e){return e.name===t.candidateName}))?t.status===a.active&&e.push(t):console.error("Something went horribly wrong, trying to assing a vote to candidate ".concat(t.candidateName,", but it was not found on the candidate list")),e}),new Array).forEach((function(e,t){var a=n.find((function(t){return t.name===e.candidateName}));a?a.votesOnCurrentRound[t]+=e.value:console.error("Something went horribly wrong, trying to assing a vote to candidate ".concat(e.candidateName,", but it was not found on the candidate list"))}))})),n.sort((function(e,t){if(void 0!==e.positionWhenElected&&void 0!==t.positionWhenElected)return e.positionWhenElected-t.positionWhenElected;if(void 0!==e.positionWhenElected&&void 0===t.positionWhenElected)return-1;if(void 0===e.positionWhenElected&&void 0!==t.positionWhenElected)return 1;for(var n=0;n<e.votesOnCurrentRound.length;++n){var a=t.votesOnCurrentRound[n]-e.votesOnCurrentRound[n];if(0!==a)return a}return 0})),{newCandidates:n,newBallots:t}}var W=function(e,t){var n=Math.ceil(.25*t.length);console.log("Any candidate with ".concat(n," votes or more is automatically elected"));var c=[],r=R(e,t),i=r.newCandidates,o=r.newBallots;c.push({candidates:i,ballots:o,info:"Any candidate with ".concat(n," votes or more is automatically elected")});for(var l=function(){console.log("Phase",c.length,"starting");for(var e=A()(c[c.length-1]),t=!1,r=function(r){var i=e.candidates[r],o=i.votesOnCurrentRound[0];if(i.status!==a.elected&&o>=n){e.candidates[r].status=a.elected,e.candidates[r].votesOnLastStage=i.votesOnCurrentRound,e.candidates[r].positionWhenElected=r,t=!0,console.log("".concat(i.name," elected!"));var l=(o-n)/o;e.ballots.forEach((function(t){var n=!1,c=!1;t.votes.forEach((function(t){if(n&&!c){var r=e.candidates.find((function(e){return e.name===t.candidateName}));r&&r.status===a.active&&(t.value=l,c=!0)}t.candidateName===i.name&&(t.status=a.elected,n=!0)}))}));var s=R(e.candidates,e.ballots),d=s.newCandidates,u=s.newBallots;c.push({candidates:d,ballots:u,info:"".concat(i.name," had more than ").concat(n," votes, so they were elected!")})}},i=0;i<e.candidates.length&&!t;++i)r(i);if(!t){var o=function(e){for(var t=null,n=e.candidates.length-1;n>=0;--n)if(e.candidates[n].status===a.active){t=e.candidates[n].name,e.candidates[n].status=a.eliminated,e.candidates[n].votesOnLastStage=e.candidates[n].votesOnCurrentRound;break}if(t)return e.ballots.forEach((function(e){e.votes.forEach((function(e){e.candidateName===t&&(e.status=a.eliminated)}))})),t;throw Error("Something went really wrong, no candidate could be eliminated")}(e),l=R(e.candidates,e.ballots),s=l.newCandidates,d=l.newBallots;c.push({candidates:s,ballots:d,info:"".concat(o," had the least votes, so they were eliminated!")})}};c[c.length-1].candidates.filter((function(e){return e.status===a.elected})).length<3;)l();return c},B=n(12);function I(e){return r.a.createElement("div",{className:"electionSelector"},r.a.createElement("span",null,r.a.createElement("h3",null,"Elections")),e.elections.map((function(t,n){return r.a.createElement("button",{key:n,onClick:function(){return e.setActiveIndex(n)},disabled:n===e.activeIndex},B.DateTime.fromJSDate(t.date).toLocaleString(B.DateTime.DATE_FULL))})))}var L=function(){var e=Object(c.useState)({elections:[]}),t=Object(m.a)(e,2),n=t[0],i=t[1],o=Object(c.useState)(0),l=Object(m.a)(o,2),v=l[0],h=l[1];Object(c.useEffect)((function(){function e(){return(e=Object(u.a)(s.a.mark((function e(){return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:x.forEach(function(){var e=Object(u.a)(s.a.mark((function e(t,c){var r,o,l,u,m,v,h,E,b,g;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=t.fileName,o=t.date,e.next=3,fetch("".concat("/election-visualizer","/data/").concat(r));case 3:return l=e.sent,e.next=6,l.text();case 6:u=e.sent,m=f.a.parse(u),v=m.data[0].slice(1),h=v.map((function(e){var t=e.match(/\[(.*)\]/),n=(t?t[1]:"").split(" ");return{name:[n[n.length-1]].concat(Object(d.a)(n.slice(0,n.length-1))).join(" "),status:a.active,votesOnCurrentRound:Array(3).fill(0)}})),E=m.data.slice(1),b=E.map((function(e){var t=e.slice(1);return{votes:p(3).map((function(e){var n=t.findIndex((function(t){return t.includes(String(e+1))}));return{candidateName:h[n].name,status:a.active,value:1}}))}})),g=W(h,b),n.elections[c]={date:o,phases:g},i({elections:n.elections});case 15:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}());case 1:case"end":return e.stop()}}),e)})))).apply(this,arguments)}!function(){e.apply(this,arguments)}()}),[]);var E=n.elections[v];return r.a.createElement("div",{className:"App"},r.a.createElement(I,{elections:n.elections,setActiveIndex:h,activeIndex:v}),E&&r.a.createElement(k,{election:E}))};o.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(L,null)),document.getElementById("root"))}},[[19,1,2]]]);
//# sourceMappingURL=main.b54a1e49.chunk.js.map