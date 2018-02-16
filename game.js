var inquirer = require("inquirer");
var chalk = require("chalk");
var Word = require("./word");
var phrase = require("./guess");

//Set guesses
function Game() {
	var self = this;

	this.play = function() {
		this.guessesLeft = 5;
		this.nextWord();
	};


//phrase to use from bank and word
this.nextWord = function() {
	var randWord = phrase[Math.floor(Math.random() * phrase.length) ];
	this.currentWord = new Word(randWord);
	console.log('\n' + this.currentWord + '\n');
	this.makeGuess();
};



//make a guess
this.makeGuess = function() {
	this.askForLetter().then(function() {
		if (self.guessesLeft < 1) {
			console.log("Game Over! The Word was:\"" + self.currentWord.getSolution() + "\"\n");
			self.PlayAgain();
		}
		else if (self.currentWord.guessedRight()) {
			console.log("Yay! You Win!");
			self.guessesLeft = 5;
			self.nextWord();
		}
		else {
			self.makeGuess();
		}
	});
};



//Play Again
this.PlayAgain = function() {
	inquirer.prompt([
	{
		type: "confirm",
		name:"choice",
		message:"Play Again?"
	}
	])
	.then(function(val) {
		if (val.choice) {
			self.play();
		}
		else {
			self.quit();
		}
	});
};



//Choose letter
this.askForLetter = function() {
	return inquirer
	.prompt([
	{
		type:"input",
		name: "choice",
		message: "pick a letter",
		validate: function(val) {
			return /[a-z1-9]/gi.test(val);
		}
	}])
	.then(function(val) {
		var yesGuessedCorrect = self.currentWord.guessedRight(val.choice);
		if (yesGuessedCorrect) {
			console.log(chalk.green("\n Correct!!\n"));

		}
		else {
			self.guessesLeft --;
			console.log(chalk.red("\n Wrong!!\n"));
			console.log("guesses left:" + self.guessesLeft );
		}
	});
};


//End
this.quit = function() {
	console.log("\n Exit Game");
	process.exit(0);
};

}

module.exports = Game;