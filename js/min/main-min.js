function restoreDifficulty(){localStorage.difficulty?setDifficulty(localStorage.difficulty,localStorage.maxDifficulty):setDifficulty(1,1)}function setDifficulty(e,t){var a=[];difficulty=e,maxDifficulty=t,localStorage.difficulty=e,localStorage.maxDifficulty=t,$(".btn-difficulty").removeClass("setDifficulty disabledDifficulty"),$('.btn-difficulty[data-set-difficulty="'+difficulty+'"]').addClass("setDifficulty"),$('.btn-difficulty[data-set-difficulty="'+maxDifficulty+'"]').nextAll().addClass("disabledDifficulty"),scoreMultiplier=e,1==e?$.merge(a,JSONSelect.match(':root>:has(.branch:val("Navy"))',ranksBackup)):2==e?($.merge(a,JSONSelect.match(':root>:has(.branch:val("Navy"))',ranksBackup)),$.merge(a,JSONSelect.match(':root>:has(.branch:val("Marines"))',ranksBackup))):a=ranksBackup,ranks=a}function getDate(){var e=new Date,t=e.getMonth()+1,a=e.getDate(),r=e.getFullYear();return{day:a,month:t,year:r}}function shuffle(e){for(var t=e.length,a,r;0!==t;)r=Math.floor(Math.random()*t),t-=1,a=e[t],e[t]=e[r],e[r]=a;return e}function copyArray(e){var t=JSON.parse(JSON.stringify(e));return t}function commaScore(e){for(;/(\d+)(\d{3})/.test(e.toString());)e=e.toString().replace(/(\d+)(\d{3})/,"$1,$2");return e}var ranks,ranksBackup,rankHistory=[],score=0,scoreMultiplier=1,time=0,maxTime=1600,timer,difficulty,maxDifficulty,conflicts={Navy:{Marines:{Officer:["Collar"]},"Air Force":{Officer:["Collar"]},Army:{Officer:["Collar"]}},Marines:{Navy:{Officer:["Collar"]},"Air Force":{Officer:["Collar"]},Army:{Officer:["Collar"]}},"Air Force":{Navy:{Officer:["Collar"]},Marines:{Officer:["Collar"]},Army:{Officer:["Collar"]}},Army:{Navy:{Officer:["Collar"]},Marines:{Officer:["Collar"]},"Air Force":{Officer:["Collar"]}}};$.expr[":"].contains=$.expr.createPseudo(function(e){return function(t){return $(t).text().toUpperCase().indexOf(e.toUpperCase())>=0}}),$(document).ready(function(){function e(){$(".loader").animateIn("fadeIn");var e=$("input[type=text]"),t=$("select"),a=$("#filter-branch"),r=$("#filter-type");console.log("filtering"),$(".reference-field").isotope({filter:function(){var t=!0;return"all"==r.val()||$(this).hasClass("type-"+r.val())||(t=!1),"all"==a.val()||$(this).hasClass("branch-"+a.val())||(t=!1),$(this).find('.reference-rank-title:contains("'+e.val()+'")').length||(t=!1),t}}),$(".reference-field").one("arrangeComplete",function(){$(".loader").animateOut("fadeOut")})}function t(e){var t=ranks;e&&(t=e);var a=-1;do a=chance.integer({min:0,max:t.length-1});while(!t[a].quiz);return t[a]}function a(){var e,a,n=rankHistory.length;do{e=t(),a=r(e);var i=JSONSelect.match(':root>:has(:val("'+a+'"))',ranks);if(-1===rankHistory.indexOf(e.id+"-"+a)&&i.length>=4)return rankHistory.push(e.id+"-"+a),copyArray(e)}while(n==rankHistory.length)}function r(e){var t=chance.integer({min:0,max:e.quiz.length-1});return e.quiz[t]}function n(e,t,a){return e.type!=t.type?!0:conflicts[e.branch]&&conflicts[e.branch][t.branch]&&conflicts[e.branch][t.branch][e.type]?-1==conflicts[e.branch][t.branch][e.type].indexOf(a)?!1:!0:!1}function i(e){var a=[],r,i=rankHistory[rankHistory.length-1].split("-")[1],c=JSONSelect.match(':root>:has(:val("'+i+'"))',ranks);do if(r=t(c),-1===a.indexOf(r)&&r.id!=e.id&&!n(e,r,i)&&(a.push(r),3==a.length))return a;while(a.length<3)}function c(){var e=rankHistory.length,t=e+1;$(".progress-current").text(t),$(".progress-dots span:lt("+t+")").addClass("active")}function o(){c(),$(".options a").remove();var e=a();e.correct=!0,$(".question-rank-branch").text(e.branch),$(".question-rank-title").text(e.title),$(".question-text").css("opacity","1"),$(".response-images").empty(),$.each(e.quiz,function(){var t=$('<div><img src="img/'+e.branch+"/"+e.abbreviation+"-"+this+'.png" class="img-responsive"><span class="insignia-tag">'+this+"</span></div>");t.appendTo(".response-images")});var t=i(e),r=[e];$.merge(t,r);var n=rankHistory[rankHistory.length-1].split("-")[1],o=shuffle(t);$.each(o,function(){var e="";this.correct&&(e='data-correct="true"');var t=$('<a href="#" '+e+' style="display:none;"><img src="img/'+this.branch+"/"+this.abbreviation+"-"+n+'.png" alt="" class="img-responsive"></a>');t.appendTo(".options")}),$("body").on("click",".options a:not(.waiting)",function(){var e='<span class="text-incorrect">Incorrect</span>';if("true"==$(this).attr("data-correct")){e='<span class="text-correct">Correct</span>';var t=500*scoreMultiplier,a=Math.floor((1600-time)/1600*(100*scoreMultiplier)),r=t+a;score+=r,$(".score-current").text(commaScore(score)),$(".score-new").text("+"+commaScore(r)).fadeIn()}else $(".score-new").fadeOut();$(".responseText").html(e),$("#response").modal({backdrop:"static"}),$("#dial").parent().fadeOut(function(){time=0,$("#dial").trigger("change")})}),$(".options a").addClass("waiting").cascadeIn("fadeInDown",function(){$(".options a").removeClass("waiting"),$("#dial").parent().fadeIn(),window.clearInterval(timer),time=0,timer=setInterval(function(){time==maxTime?clearInterval(timer):time+=1,$("#dial").val(time).trigger("change")},1)})}zE(function(){zE.show(),$(".version").append($('<a href="#" onclick="zE.activate({hideOnClose: true});" style="color:white;text-decoration:underline;margin-left:10px;">Feedback</a>'))}),localStorage.newRankUser||($("#disclaimer").modal(),localStorage.setItem("newRankUser","true")),$(window).scroll(function(){$(window).scrollTop()>20?$("body").addClass("scrolled"):$("body").removeClass("scrolled")}),localStorage.scores||$("[data-to=scoreboard]").hide(),$("#dial").knob({readOnly:!0,thickness:1,max:maxTime,width:30,height:30,bgColor:"#1C1C1C",fgColor:"#FFD081"}),$("#dial").parent().hide(),$.getJSON("js/rates.json",function(e){ranks=e,ranksBackup=ranks,restoreDifficulty(),$.each(ranksBackup,function(e){this.id=e;var t;t=this.quiz?this.branch+"/"+this.abbreviation+"-"+this.quiz[0]:this.reference?this.branch+"/"+this.abbreviation+"-"+this.reference[0]:"blank";var a=$('<a href="#" class="reference-rank type-'+this.type+" branch-"+this.branch+'" data-id="'+this.id+'"><img src="img/'+t+'.png" class="img-responsive"><span class="reference-rank-meta reference-rank-meta-branch" data-branch-label="'+this.branch+'">'+this.branch+'</span><span class="reference-rank-meta reference-rank-meta-type">'+this.type+'<br><span class="reference-rank-meta-grade">'+this.grade+'</span></span><div class="reference-rank-title">'+this.title+"</div></a>").appendTo(".reference-field")}),$('<div classs="grid-sizer"></div>').appendTo(".reference-field"),$(".reference-rank").click(function(){if(rank=ranksBackup[$(this).attr("data-id")],$(".reference-detail-title").text(rank.title),$(".reference-detail-branch").text(rank.branch),$(".reference-detail-type").text(rank.type),$(".reference-detail-grade").text(rank.grade),$(".reference-detail-description").text(rank.description),$(".reference-detail-images").empty(),rank.quiz||rank.reference){var e;rank.quiz&&rank.reference?(e=$.merge([],rank.quiz),$.merge(e,rank.reference)):e=rank.quiz?rank.quiz:rank.reference,$.each(e,function(){var e=$('<div><img src="img/'+rank.branch+"/"+rank.abbreviation+"-"+this+'.png" class="img-responsive"><span class="insignia-tag">'+this+"</span></div>");e.appendTo(".reference-detail-images")}),rank.referenceShared&&$.each(rank.referenceShared,function(){var e=$('<div><img src="img/'+rank.branch+"/"+this.image+'.png" class="img-responsive"><span class="insignia-tag">'+this.title+"</span></div>");e.appendTo(".reference-detail-images")})}else{var t=$('<div><img src="img/blank.png" class="img-responsive"></div>');t.appendTo(".reference-detail-images")}return $("#reference-detail").modal(),!1})}),$("select").change(function(){e()}),$("input[type=checkbox]").change(function(){$(this).is(":checked")?($("select").parent().css("opacity",".5"),$("select").prop("disabled","disabled")):($("select").parent().css("opacity","1"),$("select").prop("disabled",!1)),e()}),$("input[type=text]").keyup(function(){e()}),$(".intro .intro-box .box-content a").click(function(){var e=$(this).attr("data-to");return $(".intro").animateOut("fadeOut",function(){$(".nav-"+e).animateIn("fadeInDown"),$("."+e).animateIn("fadeInDown",function(){"question"==e?(score=0,rankHistory=[],o(),$(".progress-dots span:gt(0)").removeClass("active"),$(".progress-current").text("1")):"reference"==e&&$(".reference-field").isotope({itemSelector:".reference-rank",percentPosition:!0,masonry:{columnWidth:$(".reference.field").width()/2}})})}),!1}),$("[data-to=scoreboard]").click(function(){function e(e,t){return e.score<t.score?1:e.score>t.score?-1:0}var t=JSON.parse(localStorage.scores);t.sort(e);var a=t[0];$("#scoreboard-high").text(commaScore(a.score)),$("#scoreboard-high-date").text(a.month+"/"+a.day+"/"+a.year),$("#scoreboard-table").empty(),$.each(t,function(e){var t=$("<tr><th>"+(e+1)+"</th><td>"+commaScore(this.score)+"</td></tr>");4>e&&t.appendTo("#scoreboard-table")})}),$("#response .btn-continue").click(function(){$(".question-text").css("opacity","0"),$($(".options a").get().reverse()).cascadeOut("fadeOutDown",function(){rankHistory.length<10?o():($(".nav-question").animateOut("fadeOutUp"),$(".question").animateOut("fadeOutDown",function(){$(".final-score").text(commaScore(score));var e=getDate(),t={score:score,day:e.day,month:e.month,year:e.year},a=1;if(score>=5e3&&(a=2),score>=9e3&&(a=3),a>parseInt(maxDifficulty)&&(maxDifficulty=a,localStorage.maxDifficulty=maxDifficulty),restoreDifficulty(),localStorage.scores){var r=localStorage.scores;r=JSON.parse(r),r.push(t),r=JSON.stringify(r),localStorage.scores=r}else t=JSON.stringify([t]),localStorage.scores=t;$("[data-to=scoreboard]").show(),score=0,rankHistory=[],$(".score-current").text("0"),$(".score-new").fadeOut(),$("#complete").modal()}))})}),$("body").on("click",".btn-difficulty:not(.disabledDifficulty)",function(){$(".btn-difficulty").removeClass("setDifficulty"),$(this).addClass("setDifficulty");var e=$(this).attr("data-set-difficulty");return setDifficulty(e,maxDifficulty),!1}),$("#filter-toggle").click(function(){$(".filters").slideToggle(300),$(".reference").toggleClass("filtering")}),$("#back-question").click(function(){$(".nav-question").animateOut("fadeOutUp"),$(".question").animateOut("fadeOutUp",function(){$(".question-rank-title,.question-rank-branch").text(""),$(".intro").animateIn("fadeIn"),$(".options a").hide()})}),$("#back-scoreboard").click(function(){$(".nav-scoreboard").animateOut("fadeOutUp"),$(".scoreboard").animateOut("fadeOutUp",function(){$(".intro").animateIn("fadeIn")})}),$("#back-settings").click(function(){$(".nav-settings").animateOut("fadeOutUp"),$(".settings").animateOut("fadeOutUp",function(){$(".intro").animateIn("fadeIn")})}),$("#back-complete").click(function(){$(".intro").animateIn("fadeIn")}),$("#back-reference").click(function(){$(".nav-reference").animateOut("fadeOutUp"),$(".reference").animateOut("fadeOut",function(){$(".intro").animateIn("fadeIn"),$(".options a").hide()})})});