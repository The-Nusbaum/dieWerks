export class DieWerks {
  /**
   * Doesn't do anything, really. Sad Constructor.
   */
  constructor() {}

  /**
   * adds the various rolls from a multi-die roll
   * @param {Int} total the number to add to. will attempt to parse as int
   * @param {Int} num   the number to add. will attempt to parse as int
   * @return {Int}    the final total
   */
  addRolls(total, num) {
      return parseInt(total) + parseInt(num);
  }

  /**
   * Splits out the distinct XdY rolls to handle them individually
   * @param  {string} formula  a die formula, 2d6 + 2 for example
   * @return {Array}          an array of distinct rolls
   */
  getDistinctRolls(formula) {
  	var r = /\d+[dD]\d+[hlHL]?/g
    var rolls = [];
    do{
      	m = r.exec(formula)
        if (m) {
  	  		rolls.push(m);
        }
    } while(m);
    return rolls;
  }

  /**
   * [compileRolls description]
   * @param  {string} formula   a die formula, 2d6 + 2 for example
   * @return {Array}            the array of results
   */
  compileRolls(formula) {
  	let rolls = getDistinctRolls(formula);
    let out = formula;
    for (i in rolls) {
  		let result = doRoll(rolls[i][0]);
      console.log(result)
      let pattern = new RegExp(rolls[i][0]);
      out = out.replace(pattern,result.value);
    }
    return {
    	compiled: out,
      input: formula
    };
  }

  /**
   * Actually rolls a die
   * @param  {Int} max    the upper limit, or highest die face
   * @return {Int}        te numerical result of a single roll
   */
  rollD(max) {
  	return Math.round(Math.random() * (max - 1) + 1);
  }

  /**
   * the money maker. Actually handles the complex die logic, modifiers,
   * modes, etc.
   * @param  {String} formula a die formula, 2d6 + 2 for example
   * @return {Array}         the reulsts of the roll, and associated meta info
   */
  doRoll(formula) {
  	let rolls = [];
    let rollsAry = [];
    let tmpRoll = '';
    let out;
    let r = /(\d+)[dD](\d+)([a-zA-Z]?)/g;
    let m = r.exec(formula);
    if (m) {
      if(m[3].match(/[aA]/)) {
      	let tmpFormula = formula.replace(/[aA]/,'')
      	let roll1 = doRoll(tmpFormula);
        let roll2 = doRoll(tmpFormula);
        let val,str;

        if(roll1.value > roll2.value) {
        	let val = roll1.value;
          let str = "-" + roll2.value + "-, " + roll1.value;
        } else {
        	let val = roll2.value;
          let str = "-" + roll1.value + "-, " + roll2.value;
        }
        out = {
        	value: val,
          string: str
        }
      } else if(m[3].match(/[dD]$/)) {
        let tmpFormula = formula.replace(/[dD]$/,'');
      	let roll1 = doRoll(tmpFormula);
        let roll2 = doRoll(tmpFormula);
        let val,str;
        if(roll1.value < roll2.value) {
        	val = roll1.value;
          str = "-" + roll2.value + "-, " + roll1.value;
        } else {
        	val = roll2.value;
          str = "-" + roll1.value + "-, " + roll2.value;
        }
        out = {
        	value: val,
          string: str
        }
      } else {
        for(x = 0; x < m[1]; x++) {
          rolls.push(rollD(m[2]));
        }
        if(rolls.length == 1)  {
          out = {
            value: rolls[0],
            string: rolls[0]
          };
        } else {
          rolls = rolls.sort();

          if(m[3].match(/[hH]/)) {
            tmpRoll = rolls.shift();
            rollsAry = rolls.slice(0);
            rollsAry.unshift('-' + tmpRoll + '-');
          } else if(m[3].match(/[lL]/)) {
            tmpRoll = rolls.pop();
            rollsAry = rolls.slice(0);
            rollsAry.push('-' + tmpRoll + '-');
          } else {
          	rollsAry = rolls.slice(0);
          }
          rolls = rolls.reduce(addRolls);
        	out = {
        		value: rolls,
        		string: rollsAry.join(', ')
      		};
        }
      }
    }
    return out;
  }
}
