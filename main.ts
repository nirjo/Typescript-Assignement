
interface Employee {
uniqueId: number;
name: string;
subordinates: Employee[];
}

const tree = [{"name":"Mark Zuckerberg","subs":[{"name":"Sarah Donald","subs":[{"name":"Marye Blue","subs":[]},{"name":"Bob Saget","subs":[{"name":"Tina Teff","subs":[{"name":"Will Turnter","subs":[]}]}]}]},{"name":"Tyler Simpson","subs":[{"name":"Harry Tobs","subs":[{"name":"Thomas Brown","subs":[]}]},{"name":"George Carrey","subs":[]},{"name":"Gary Styles","subs":[]}]},{"name":"Bruce Willis","subs":[]},{"name":"Georgina Flangy","subs":[{"name":"Sophie Turner","subs":[]}]}]}]

let count = 0
function populate(current){
	
	const temp : Employee = {
		uniqueId: count,
		name: current.name,
		subordinates: []
	}
	count = count+1
	for(var i=0;i< current.subs.length;i++){
		temp.subordinates.push(populate(current.subs[i]))
	}
	return temp;
	
}


interface IEmployeeOrgApp {
	ceo: Employee;
	/**
		* Moves the employee with employeeID (uniqueId) under a supervisor
		(another employee) that has supervisorID (uniqueId).
		* E.g. move Bob (employeeID) to be subordinate of Georgina
		(supervisorID). * @param employeeID
		* @param supervisorID
	*/
	move(employeeID: number, supervisorID: number): void;
	/** Undo last move action */
	undo(): void;
	/** Redo last undone action */
	redo(): void;
}
class  EmployeeOrgApp implements IEmployeeOrgApp  {
	ceo: Employee;
	bossIds:number[][]
	bossIdIndex:number[]
	maxMoveIndex:number[]
	refIds:Employee[]
	childIds:number[][][]
	childIdIndex:number[]
	
	constructor(c:Employee){
		this.ceo=c;
		this.bossIds=[];
		this.bossIdIndex=[];
		this.maxMoveIndex=[];
		this.refIds=[];
		this.childIds=[];
		this.childIdIndex=[];
		
		this.buildIndex(this.ceo);
		
		
	}
	buildIndex(emp){
		this.refIds[emp.uniqueId]=emp;
		this.childIds[emp.uniqueId]=new Array();
		this.childIds[emp.uniqueId][0] = new Array();
		for(var i=0;i<emp.subordinates.length;i++){
			this.bossIds[emp.subordinates[i].uniqueId]= [emp.uniqueId];
			this.childIds[emp.uniqueId][0].push(emp.subordinates[i].uniqueId);
			this.bossIdIndex[emp.subordinates[i].uniqueId] = 1;
			this.maxMoveIndex[emp.subordinates[i].uniqueId] = 1;
			this.childIdIndex[emp.uniqueId] = 1;
			
			this.buildIndex(emp.subordinates[i]);
		}
		
	}
	find_sub(bossid: number, subid: number){
		for(var i=0;i<this.refIds[bossid].subordinates.length ;i++){
			if(this.refIds[bossid].subordinates[i].uniqueId==subid)
				break;
		}
		return i;
	}
	clear_sub(bossid: number, subid: number){
		
		var i = this.find_sub(bossid,subid)
		if(i<this.refIds[bossid].subordinates.length)
			this.refIds[bossid].subordinates.splice(i,1)
	}
	shift(employeeID: number, supervisorID: number){
		
		
		
		var pervBossId = this.bossIds[employeeID] [this.bossIdIndex[employeeID]-1]
		this.childIds[pervBossId][this.childIdIndex[pervBossId]] = new Array();
		for(var i =0;i< this.refIds[pervBossId].subordinates.length;i++){
			this.childIds[pervBossId][this.childIdIndex[pervBossId]].push(this.refIds[pervBossId].subordinates[i].uniqueId)
		}
		for(var i =0;i< this.refIds[employeeID].subordinates.length;i++){
			
			
			this.refIds[pervBossId].subordinates.push(this.refIds[employeeID].subordinates[i]);
			
			this.bossIds[this.refIds[employeeID].subordinates[i].uniqueId] [this.bossIdIndex[employeeID] ] = pervBossId
			this.bossIdIndex[this.refIds[employeeID].subordinates[i].uniqueId] = this.bossIdIndex[this.refIds[employeeID].subordinates[i].uniqueId] +1;
			
			this.childIds[pervBossId][this.childIdIndex[pervBossId]].push(this.refIds[employeeID].subordinates[i].uniqueId)
			this.maxMoveIndex[this.refIds[employeeID].subordinates[i].uniqueId] = this.maxMoveIndex[this.refIds[employeeID].subordinates[i].uniqueId] +1;
		}
		this.childIdIndex[pervBossId] = this.childIdIndex[pervBossId]+1
		
		this.bossIds[employeeID] [this.bossIdIndex[employeeID] ] = supervisorID
		this.refIds[supervisorID].subordinates.push(this.refIds[employeeID]);
		this.refIds[employeeID].subordinates = []
		this.clear_sub(pervBossId,employeeID)
		
	}
	/**
		* Moves the employee with employeeID (uniqueId) under a supervisor
		(another employee) that has supervisorID (uniqueId).
		* E.g. move Bob (employeeID) to be subordinate of Georgina
		(supervisorID). * @param employeeID
		* @param supervisorID
	*/
	move(employeeID: number, supervisorID: number){
		
		if(employeeID!=0)
			this.shift(employeeID,supervisorID)
		else if(employeeID==0)
			console.log("Sorry cannot move CEO")
		// this.refIds[employeeID].subordinates = []
		
		
		
		
		
		//copy all the subs to prev boss
		// how do you find out the prev boss
		//?? 
		// store all the reference against id
		//copy self to new boss
	}
	/** Undo last move action */
	undo(){
		//check anything to undo
		//find perv boss from bossid
	}
	/** Redo last undone action */
	redo(){
		//check anyting to redo
		//find prev boss to redo
	}
	print (temp:Employee,lvl:number){
		console.log(''.padStart(lvl*5) ,temp.name,",id :"+temp.uniqueId)
		
		if(temp.subordinates.length == 0)
			return
		for( var i =0;i<temp.subordinates.length;i++)
			this.print( temp.subordinates[i],lvl+1);
		
	}
	showTree(){
		this.print(this.ceo,0)
	}
}
const ceo = populate(tree[0])
const app = new EmployeeOrgApp(ceo)
app.showTree();
app.move(3,12)
app.showTree();
