var bf = require("../bloomfilter"),
$ = require('jquery'),
BloomFilter = bf.BloomFilter,
fnv_1a = bf.fnv_1a,
csv = require('csv'),
fs = require('fs'),
parse = require('csv-parse');

var vows = require("vows"),
assert = require("assert");

var inputFile='majestic_million.csv';

var suite = vows.describe("bloomfilter");

var domains = new Array();

var parser = parse({delimiter: ','}, function (err, data) {
  console.log("adding domains");
  data.forEach(function(line) {
    domains.push(line[2]);
  });
  console.log("finished adding domains");
  suite.addBatch({
    "bloom filter": {
      "basic": function() {
        var f = new BloomFilter(1000, 4),
        n1 = "Bess",
        n2 = "Jane";
        f.add(n1);
        assert.equal(f.test(n1), true);
        assert.equal(f.test(n2), false);
      },
      "majestic": function() {
        var m = new BloomFilter(700000000, 100);
        for (var i = 0; i < domains.length; i++) {
          m.add(domains[i]);
        }
        assert.equal(m.test("google.com"), true);
        assert.equal(m.test("thisisafakedomain"), false);
      }
    }
  });

  suite.export(module);  
});

fs.createReadStream(inputFile).pipe(parser);


