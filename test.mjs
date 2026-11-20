import test from 'node:test';
import assert from 'node:assert/strict';
import {run} from './engine.mjs';
import {sample} from './sample.mjs';
test('domain behavior and boundary cases',()=>{assert.equal(run(sample).metrics.value,14);assert.equal(run({...sample,capacity:0}).metrics.value,0);assert.throws(()=>run({...sample,capacity:1.5}));});
test('deterministic result and input preservation',()=>{const copy=JSON.stringify(sample);assert.deepEqual(run(sample),run(sample));assert.equal(JSON.stringify(sample),copy);});
test('reject malformed root and oversized input',()=>{assert.throws(()=>run(null));assert.throws(()=>run([]));assert.throws(()=>run({...sample,oversized:'x'.repeat(200001)}));});

test('duplicate task IDs are rejected',()=>{assert.throws(()=>run({capacity:8,tasks:[{id:'a',cost:2,value:3},{id:'a',cost:3,value:4}]}));});
