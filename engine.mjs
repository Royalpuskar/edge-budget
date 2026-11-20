
function obj(v){if(!v||typeof v!=='object'||Array.isArray(v))throw Error('Expected an object');return v;}
function arr(v,label='array'){if(!Array.isArray(v)||v.length>500)throw Error(label+' must be an array with at most 500 items');return v;}
function str(v){if(typeof v!=='string'||!v.trim()||v.length>100000)throw Error('Expected nonempty text (max 100000 characters)');return v;}
function num(v,label='number',min=-1e12){if(typeof v!=='number'||!Number.isFinite(v)||v<min||Math.abs(v)>1e12)throw Error(label+' must be a finite number in range');return v;}
function bool(v){if(typeof v!=='boolean')throw Error('Expected a boolean');return v;}
function date(v){if(typeof v!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(v))throw Error('Expected YYYY-MM-DD');const t=Date.parse(v+'T00:00:00Z');if(!Number.isFinite(t)||new Date(t).toISOString().slice(0,10)!==v)throw Error('Invalid calendar date');return t;}
export function run(x){obj(x);if(JSON.stringify(x).length>200000)throw Error('Input exceeds 200 KB limit');

num(x.capacity,'capacity',0);if(!Number.isInteger(x.capacity)||x.capacity>10000)throw Error('Capacity must be integer <=10000');const tasks=arr(x.tasks,'tasks');const ids=new Set();for(const t of tasks){str(t.id);if(ids.has(t.id))throw Error('Duplicate task ID');ids.add(t.id);}const dp=Array.from({length:x.capacity+1},()=>({value:0,ids:[]}));for(const t of tasks){str(t.id);num(t.cost,'cost',1);num(t.value,'value',0);if(!Number.isInteger(t.cost))throw Error('Integer costs required');for(let c=x.capacity;c>=t.cost;c--){const p=dp[c-t.cost];if(p.value+t.value>dp[c].value)dp[c]={value:p.value+t.value,ids:[...p.ids,t.id]};}}return {metrics:{capacity:x.capacity,value:dp[x.capacity].value,selected:dp[x.capacity].ids.length},rows:tasks.map(t=>({...t,selected:dp[x.capacity].ids.includes(t.id)}))};

}
