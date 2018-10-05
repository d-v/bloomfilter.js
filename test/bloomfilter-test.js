var bf = require("../bloomfilter"),
$ = require('jquery'),
fnv_1a = bf.fnv_1a,
csv = require('csv'),
fs = require('fs'),
parse = require('csv-parse');

let max_array_size = 1000000;

const { BloomFilter } = require('bloom-filters')
let filter = new BloomFilter(max_array_size, 0.01)
var fs = require('fs');

try {
  content = fs.readFileSync('majestic_million.json');
  var jsonContent = JSON.parse(content);
  const importedFilter = BloomFilter.fromJSON(jsonContent);
} catch (err) {
  if (err.code === 'ENOENT') {
    console.log('File not found!');
  } else {
    console.log('other error!');
  }
}

var vows = require("vows"),
assert = require("assert");

var inputFile='majestic_million.csv';

var suite = vows.describe("bloomfilter");

var domains = new Array();

console.log("adding domains");

var parser = parse({delimiter: ','}, function (err, data) {
  var i = 0;
  data.some(function(line) {
    if(i == max_array_size) return true;
    domains.push(line[2]);
    i++;
  });
  console.log("finished adding domains");
  suite.addBatch({
    "bloom filter": {
      "majestic": function() {
        filter = BloomFilter.from(domains, .01);
        console.log(filter.has('bob'));
        console.log(filter.has('google.com'));
        const exported = filter.saveAsJSON();
        console.log(filter);
        fs.writeFile ("majestic_million.json", JSON.stringify(exported), function(err) {
          if (err) throw err;
          console.log('complete');
        });
      }
    }
  });

  suite.export(module);  
});

fs.createReadStream(inputFile).pipe(parser);


