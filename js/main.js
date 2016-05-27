

//create ranks array
var ranks;
var ranksBackup;

//create history of quesitons array
var rankHistory=[];

//create score and reset
var score=0;
var scoreMultiplier=1;

//timing variables
var time = 0,
maxTime = 1600,
timer;

//difficulty setting
var difficulty;
var maxDifficulty;

//conflicts object to keep identical ranks to be shown as distractors
var conflicts={
	"Navy":{
		"Marines":{
			"Officer":["Collar"]
		},
		"Air Force":{
			"Officer":["Collar"]
		},
		"Army":{
			"Officer":["Collar"]
		}
	},
	"Marines":{
		"Navy":{
			"Officer":["Collar"]
		},
		"Air Force":{
			"Officer":["Collar"]
		},
		"Army":{
			"Officer":["Collar"]
		}
	},
	"Air Force":{
		"Navy":{
			"Officer":["Collar"]
		},
		"Marines":{
			"Officer":["Collar"]
		},
		"Army":{
			"Officer":["Collar"]
		}
	}
	,
	"Army":{
		"Navy":{
			"Officer":["Collar"]
		},
		"Marines":{
			"Officer":["Collar"]
		},
		"Air Force":{
			"Officer":["Collar"]
		}
	}
}


//retrieves diffculty settings
function restoreDifficulty(){

	//if difficulty exists in local storage, use that, otherwise start easy
	if(localStorage.difficulty){
		setDifficulty(localStorage.difficulty,localStorage.maxDifficulty);
	}
	else{
		setDifficulty(1,1);
	}
}

//sets difficulty setting
function setDifficulty(dif, dmax){

	//difficulty subset array
	var difficultySubset=[];

	//set global difficulty and max available difficulty, store in localstorage
	difficulty=dif;
	maxDifficulty=dmax;
	localStorage.difficulty=dif;
	localStorage.maxDifficulty=dmax;

	//set difficulty button states (active and disabled)
	$('.btn-difficulty').removeClass('setDifficulty disabledDifficulty');
	$('.btn-difficulty[data-set-difficulty="'+difficulty+'"]').addClass('setDifficulty');
	$('.btn-difficulty[data-set-difficulty="'+maxDifficulty+'"]').nextAll().addClass('disabledDifficulty');

	//define subset of ranks and score multiplier based on difficulty setting
	scoreMultiplier=dif;
	if(dif==1){
		$.merge(difficultySubset,JSONSelect.match(':root>:has(.branch:val("Navy"))', ranksBackup));
	}
	else if(dif==2){
		$.merge(difficultySubset,JSONSelect.match(':root>:has(.branch:val("Navy"))', ranksBackup));
		$.merge(difficultySubset,JSONSelect.match(':root>:has(.branch:val("Marines"))', ranksBackup));
	}
	else{
		difficultySubset=ranksBackup;
	}

	//set active ranks field as subset
	ranks=difficultySubset;

}

//case insensitive 'contains' selector
$.expr[":"].contains = $.expr.createPseudo(function(arg) {
    return function( elem ) {
        return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
});

//return current date
function getDate(){
	var d = new Date();

	var month = d.getMonth()+1;
	var day = d.getDate();
	var year = d.getFullYear();
	return {"day":day,"month":month,"year":year};
}


//shuffle arrays
function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex ;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

function copyArray(targetArray){
	var clonedArray = JSON.parse(JSON.stringify(targetArray));
	return clonedArray;
}

function commaScore(val){
    while (/(\d+)(\d{3})/.test(val.toString())){
      val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
    }
    return val;
  }


document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady()
{

	alert(screen.orientation);
	alert($(window).width());
	if($(window).width()>=768){
		screen.lockOrientation('landscape');
	}
	else{
		screen.lockOrientation('portrait');
	}
}


$(document).ready(function(){
	


	//zendesk if online
	zE(function() {
		zE.hide();
		$('.version').append($('<a href="#" onclick="zE.activate({hideOnClose: true});" style="color:white;text-decoration:underline;margin-left:10px;">Feedback</a>'));
	});

	//disclaimer when new
	if(!localStorage.newUser){
		$('#disclaimer').modal();
		localStorage.setItem('newUser','true');
	}
	else{
		
	}
	

	//add scrolled class when page scrolls
	$(window).scroll(function(){
		if($(window).scrollTop()>20){
			$('body').addClass('scrolled');
		}
		else{
			$('body').removeClass('scrolled');
		}
	});


	//hide scoreboard if empty
	if(!localStorage.scores){
		$('[data-to=scoreboard]').hide();
	}

	//initialize timer
	$('#dial').knob({
		readOnly : true,
		thickness : 1,
		max : maxTime,
		width: 30,
		height: 30,
		bgColor: '#1C1C1C',
		fgColor: '#FFD081'
	});
	$('#dial').parent().hide();

	//load ranks from json file, populate reference field
	$.getJSON('js/rates.json',function(data){

		

		//update ranks variable
		ranks=data;
		ranksBackup=ranks;

		//restore difficulty
		restoreDifficulty();

		//populate ranks field
		

		$.each(ranksBackup,function(index){
			this.id=index;

			var imgURL;
			if(this.quiz){
				imgURL=this.branch+'/'+this.abbreviation+'-'+this.quiz[0];
			}
			else if(this.reference){
				imgURL=this.branch+'/'+this.abbreviation+'-'+this.reference[0];
			}
			else{
				imgURL='blank';
			}

			var newRank=$('<a href="#" class="reference-rank type-'+this.type+' branch-'+this.branch+'" data-id="'+this.id+'">'+
				'<img src="img/'+imgURL+'.png" class="img-responsive">'+
				'<span class="reference-rank-meta reference-rank-meta-branch" data-branch-label="'+this.branch+'">'+this.branch+'</span>'+
				'<span class="reference-rank-meta reference-rank-meta-type">'+this.type+'<br><span class="reference-rank-meta-grade">'+this.grade+'</span></span>'+
				'<div class="reference-rank-title">'+
					this.title+
				'</div>'+
			'</a>').appendTo('.reference-field');
		});
		$('<div classs="grid-sizer"></div>').appendTo('.reference-field');

		//click action to open modal
		$('.reference-rank').click(function(){
			rank=ranksBackup[$(this).attr('data-id')];

			$('.reference-detail-title').text(rank.title);
			$('.reference-detail-branch').text(rank.branch);
			$('.reference-detail-type').text(rank.type);
			$('.reference-detail-grade').text(rank.grade);
			$('.reference-detail-description').text(rank.description);

			//emtpy image field in refernce detail modal
			$('.reference-detail-images').empty();

			


			if(rank.quiz||rank.reference){
				//merge quiz and reference insignia arrays (if available)
				var quizPlusReference;
				if(rank.quiz&&rank.reference){
					quizPlusReference=$.merge([],rank.quiz);
					$.merge(quizPlusReference,rank.reference);
				}	
				else if(rank.quiz){
					quizPlusReference=rank.quiz;
				}
				else{
					quizPlusReference=rank.reference;
				}

				//insert images into modal
				$.each(quizPlusReference, function(){
					var newInsignia=$('<div><img src="img/'+rank.branch+'/'+rank.abbreviation+'-'+this+'.png" class="img-responsive"><span class="insignia-tag">'+this+'</span></div>');
					newInsignia.appendTo('.reference-detail-images');
				});
				
				if(rank.referenceShared){
					$.each(rank.referenceShared, function(){
						var newInsignia=$('<div><img src="img/'+rank.branch+'/'+this.image+'.png" class="img-responsive"><span class="insignia-tag">'+this.title+'</span></div>');
						newInsignia.appendTo('.reference-detail-images');
					});
				}
			}
			else{
				//if no insignia, show blank
				var newInsignia=$('<div><img src="img/blank.png" class="img-responsive"></div>');
				newInsignia.appendTo('.reference-detail-images');
			}		

			//open modal
			$('#reference-detail').modal();
			return false;
		});
		
	});


	//change isotope field basedon filter settings
	function updateFilter(){

		$('.loader').animateIn('fadeIn');
		var textbox=$('input[type=text]');
		var selectbox=$('select');
		var branch=$('#filter-branch');
		var type=$('#filter-type');
		//isotope filtering
		console.log('filtering');
		$('.reference-field').isotope({
			filter:function(){
				
				var allTrue=true;

				if(type.val()!='all' && !$(this).hasClass('type-'+type.val())){
					allTrue=false;
				}

				if(branch.val()!='all' && !$(this).hasClass('branch-'+branch.val())){
					allTrue=false;
				}

				if(!$(this).find('.reference-rank-title:contains("'+textbox.val()+'")').length){
					allTrue=false;
				}

				return allTrue;
			}
		});
		$('.reference-field').one( 'arrangeComplete', function() {
			$('.loader').animateOut('fadeOut');
		});
	}

	$('select').change(function(){
		updateFilter();
	});

	$('input[type=checkbox]').change(function(){
		if($(this).is(':checked')){
			$('select').parent().css('opacity','.5');
			$('select').prop('disabled','disabled');
		}
		else{
			$('select').parent().css('opacity','1');
			$('select').prop('disabled',false);
		}		
		updateFilter();

	});

	$('input[type=text]').keyup(function(){
		updateFilter();
	});


	//returns random rank
	function getRandomRank(possibleDistractors){
		var set=ranks;
		if(possibleDistractors){
			set=possibleDistractors;
		}

		var randomIndex=-1;

		do{
			randomIndex=chance.integer({min:0, max:set.length-1});
		}
		while(!set[randomIndex].quiz);

		return set[randomIndex];
	}



	//returns random rank not in rank history
	function getUniqueRank(){
		var addedrank;
		var insignia;
		var originalHistoryLength=rankHistory.length;

		//repeat until unique rank found
		do{
			addedrank=getRandomRank();
			insignia=getRandomInsignia(addedrank);

			var possibleDistractors = JSONSelect.match(':root>:has(:val("'+insignia+'"))', ranks);

			if(rankHistory.indexOf(addedrank.id+'-'+insignia)===-1&&possibleDistractors.length>=4){
				rankHistory.push(addedrank.id+'-'+insignia);
				return copyArray(addedrank);
			}
		}
		while(originalHistoryLength==rankHistory.length);
	}

	//returns acceptable insignia for rank
	function getRandomInsignia(addedrank){
		var randomIndex=chance.integer({min:0, max:addedrank.quiz.length-1});
		return addedrank.quiz[randomIndex];
	}

	//checks conflicts object, returns presence of conflict
	function conflictExists(questionRank,distractor,insignia){

		if(questionRank.type!=distractor.type){
			return true;
		}
		else{
			//console.log(questionRank,distractor,insignia);
			if(conflicts[questionRank.branch]){

				if(conflicts[questionRank.branch][distractor.branch]){
					if(conflicts[questionRank.branch][distractor.branch][questionRank.type]){
						
						if(conflicts[questionRank.branch][distractor.branch][questionRank.type].indexOf(insignia)==-1){
							return false;
						}
						else{
							return true;
						}
					}
					else{
						return false;
					}
				}
				else{
					return false;
				}
				
			}
			else{
				return false;
			}
		}

			
	}

	//returns unique set of distractors, not including question rank
	function getDistrators(questionRank){
		var distractors=[];
		var distractor;
		var insignia=rankHistory[rankHistory.length-1].split('-')[1];
		
		var possibleDistractors = JSONSelect.match(':root>:has(:val("'+insignia+'"))', ranks);
		
		//repeat until 3 unique distractors found
		do{
			distractor=getRandomRank(possibleDistractors);
			
			if(distractors.indexOf(distractor)===-1&&distractor.id!=questionRank.id&&!conflictExists(questionRank,distractor,insignia)){
				distractors.push(distractor);

				if(distractors.length==3){
					return distractors;
				}
			}
		}
		while(distractors.length<3);
	}

	//updates progress indicator area for quiz
	function updateProgress(){
		var currentIndex=rankHistory.length;
		var current=currentIndex+1;

		$('.progress-current').text(current);

		$('.progress-dots span:lt('+current+')').addClass('active');
	}

	//loads question and options
	function loadQuestion(){

		//update progress indicator
		updateProgress();

		//clear options
		$('.options a').remove();

		//get random unique rank, that hasn't been previously shown
		var questionRank=getUniqueRank();

		//mark rank as correct
		questionRank.correct=true;
		$('.question-rank-branch').text(questionRank.branch);
		$('.question-rank-title').text(questionRank.title);
		$('.question-text').css('opacity','1');
		
		//load response images into response modal
		$('.response-images').empty();
		$.each(questionRank.quiz,function(){
			var newInsignia=$('<div><img src="img/'+questionRank.branch+'/'+questionRank.abbreviation+'-'+this+'.png" class="img-responsive"><span class="insignia-tag">'+this+'</span></div>');
			newInsignia.appendTo('.response-images');
		});

		//get unique distractors
		var distractors=getDistrators(questionRank);
		var correct=[questionRank];

		//merge distractors and correct together
		$.merge(distractors,correct);

		//identify current insignia set
		var insignia=rankHistory[rankHistory.length-1].split('-')[1];
		
		//shuffle options
		var options=shuffle(distractors);

		//mark option as correct, add shuffled options to screen
		$.each(options,function(){
			var correctString='';

			if (this.correct){
				correctString='data-correct="true"';
			}
			var newOption=$('<a href="#" '+correctString+' style="display:none;"><img src="img/'+this.branch+'/'+this.abbreviation+'-'+insignia+'.png" alt="" class="img-responsive"></a>');
			newOption.appendTo('.options');
		});

		//click actions for options
		$('.options a').click(function(){
			
			//set correct/incorrect response text
			var responseText='<span class="text-incorrect">Incorrect</span>';

			if ($(this).attr('data-correct')=='true'){
				responseText='<span class="text-correct">Correct</span>';

				//calculate points including time bonus
				var correctPoints=500*scoreMultiplier;
				var timeBonus=Math.floor(((1600-time)/1600)*(100*scoreMultiplier));
				var additional=correctPoints+timeBonus;
				
				//add points to score
				score+=additional;

				//update score tracker
				$('.score-current').text(commaScore(score));
				$('.score-new').text('+'+commaScore(additional)).fadeIn();
			}
			else{
				$('.score-new').fadeOut();
			}

			//update and show response modal
			$('.responseText').html(responseText);
			$('#response').modal({
				backdrop: 'static'
			});

			//fade out timer dial
			$('#dial').parent().fadeOut(function(){
				time=0;
				$('#dial').trigger('change');
			});
		});

		

		//animate in options
		$('.options a').cascadeIn('fadeInDown',function(){
			
			//fade in dial and reset
			$('#dial').parent().fadeIn();
			window.clearInterval(timer);
			time=0;

			//timing interval
			timer=setInterval(function() {
				
				//if time runs out, stop timer
				if(time==maxTime) {
					clearInterval(timer);
				}
				else{
					time+=1;
				}

				//update timer wheel
				$('#dial')
					.val(time)
					.trigger('change');
			}, 1);
		});
	}

	//screen destinations from home
	$('.intro .intro-box .box-content a').click(function(){
		var toTarget=$(this).attr('data-to');
		$('.intro').animateOut('fadeOut',function(){
			$('.nav-'+toTarget).animateIn('fadeInDown');
			$('.'+toTarget).animateIn('fadeInDown',function(){
				if(toTarget=='question'){
					score=0;
					rankHistory=[];
					loadQuestion();		
					$('.progress-dots span:gt(0)').removeClass('active');	
					$('.progress-current').text('1');		
				}
				else if(toTarget=='reference'){
					$('.reference-field').isotope({
						itemSelector: '.reference-rank',
						percentPosition: true,
						masonry: {
							columnWidth: $('.reference.field').width()/2
						}
					});
				}
			});
		});
		return false;
	});

	//build scoreboard
	$('[data-to=scoreboard]').click(function(){
		//copy of scores local storage
		var scores=JSON.parse(localStorage.scores);

		//comparison sort function for top scores list
		function compare(a,b) {
			if (a.score < b.score)
				return 1;
			if (a.score > b.score)
				return -1;
			return 0;
		}

		//sort score array
		scores.sort(compare);

		//get highest score and populate meta data
		var highscore=scores[0];
		$('#scoreboard-high').text(commaScore(highscore.score));
		$('#scoreboard-high-date').text(highscore.month+'/'+highscore.day+'/'+highscore.year);
		
		//clear and build top score table
		$('#scoreboard-table').empty();
		$.each(scores,function(index){
			var newRow=$('<tr>'+
			'<th>'+(index+1)+'</th>'+
			'<td>'+commaScore(this.score)+'</td></tr>');
			if(index<4) newRow.appendTo('#scoreboard-table');
		});
	});

	//load new set on continue
	$('#response .btn-continue').click(function(){
		$('.question-text').css('opacity','0');
		$($('.options a').get().reverse()).cascadeOut('fadeOutDown',function(){
			//if game incomplete, ask another question
			if(rankHistory.length<10){
				loadQuestion();
			}
			else{
				//if game complete, animate out question, and nav
				$('.nav-question').animateOut('fadeOutUp');

				$('.question').animateOut('fadeOutDown',function(){
					//store score along with date in scoreboard local storage

					$('.final-score').text(commaScore(score));
					var date=getDate();
					var scoreObj={
						"score":score,
						"day":date.day,
						"month":date.month,
						"year":date.year
					}
					
					//if score merits unlocking new max difficulty, unlock and store new max
					var newMaxDifficulty=1;
					if (score>=5000){
						newMaxDifficulty=2;
					}
					if(score>=9000){
						newMaxDifficulty=3;
					}

					if (newMaxDifficulty>parseInt(maxDifficulty)){
						maxDifficulty=newMaxDifficulty;
						localStorage.maxDifficulty=maxDifficulty;
					}
					restoreDifficulty();

					//add to existing localstorage scorebard, or create if empty
					if(localStorage.scores){
						var existingScores=localStorage.scores;
						existingScores=JSON.parse(existingScores);
						existingScores.push(scoreObj);
						existingScores=JSON.stringify(existingScores);
						localStorage.scores=existingScores;
					}
					else{
						scoreObj=JSON.stringify([scoreObj]);
						localStorage.scores=scoreObj;
					}

					//show scoreboard link, if hidden because previously empty
					$('[data-to=scoreboard]').show();

					//reset score, rankhistory, score display, new points alert
					score=0;
					rankHistory=[];
					$('.score-current').text('0');
					$('.score-new').fadeOut();

					//show completion screen
					$('#complete').modal();
				});
			}
		});
	});

	//difficulty buttons
	$('.btn-difficulty:not(.disabledDifficulty)').click(function(){
		
		//set button highlight
		$('.btn-difficulty').removeClass('setDifficulty');
		$(this).addClass('setDifficulty');

		//pull difficulty level from button
		var difficultyLevel=$(this).attr('data-set-difficulty');
		setDifficulty(difficultyLevel,maxDifficulty);

		return false;
	});

	$('#filter-toggle').click(function(){
		$('.filters').slideToggle(300);
		$('.reference').toggleClass('filtering');
	});


	//to intro from question
	$('#back-question').click(function(){
		$('.nav-question').animateOut('fadeOutUp');

		$('.question').animateOut('fadeOutUp',function(){
			$('.question-rank-title,.question-rank-branch').text('');
			$('.intro').animateIn('fadeIn');
			$('.options a').hide();
		});
	});

	//to intro from scoreboard
	$('#back-scoreboard').click(function(){
		$('.nav-scoreboard').animateOut('fadeOutUp');

		$('.scoreboard').animateOut('fadeOutUp',function(){
			$('.intro').animateIn('fadeIn');
		});
	});

	//to intro from settings
	$('#back-settings').click(function(){
		$('.nav-settings').animateOut('fadeOutUp');

		$('.settings').animateOut('fadeOutUp',function(){
			$('.intro').animateIn('fadeIn');
		});
	});

	//to intro from complete
	$('#back-complete').click(function(){
		$('.intro').animateIn('fadeIn');
	});

	//to intro from reference
	$('#back-reference').click(function(){
		$('.nav-reference').animateOut('fadeOutUp');

		$('.reference').animateOut('fadeOut',function(){
			$('.intro').animateIn('fadeIn');
			$('.options a').hide();
		});
	});


});

