//test
const util = require('./utilities.js');

// test data setup
var reads = [
   {dewey: "100.456", read: "Fully", pages: 100},
   {dewey: "103.456", read: "Fully", pages: 100},
   {dewey: "113.456", read: "Fully", pages: 100},
   {dewey: "123.456", read: "Fully", pages: 110},
   {dewey: "203.456", read: "Fully", pages: 100},
   {dewey: "213.456", read: "Fully", pages: 100},
   {dewey: "223.456", read: "Fully", pages: 110},
];

var partialReads = [
   {dewey: "100.456", read: "Partially", pages: 100},
   {dewey: "103.456", read: "Partially", pages: 100},
   {dewey: "113.456", read: "Partially", pages: 100},
   {dewey: "123.456", read: "Partially", pages: 110},
   {dewey: "203.456", read: "Partially", pages: 100},
   {dewey: "213.456", read: "Partially", pages: 100},
   {dewey: "223.456", read: "Partially", pages: 110},
]; 

var unreadReads = [
   {dewey: "100.456", read: "Unread", pages: 100},
   {dewey: "103.456", read: "Unread", pages: 100},
   {dewey: "113.456", read: "Unread", pages: 100},
   {dewey: "123.456", read: "Unread", pages: 110},
   {dewey: "203.456", read: "Unread", pages: 100},
   {dewey: "213.456", read: "Unread", pages: 100},
   {dewey: "223.456", read: "Unread", pages: 110},
]; 

var categories = {
   "000": "General",
   "100": "Philosophy",
   "200": "Religion",
   "300": "Science",
   "400": "Language"
};
var moreCategories = {
   "000": "General",
   "100": "Philosophy",
   "103": "Dictionaries of philosophy",
   "110": "Metaphysics",
   "111": "Ontology",
   "113": "Cosmology (Philosophy of nature)",
   "120": "120 Epistemology, causation, humankind",
   "123": "Determinism & indeterminism",
   "129": "Origin & destiny of individual souls",
   "200": "Religion",
   "203": "203 Dictionaries of Christianity",
   "210": "Natural theology",
   "211": "Concepts of God",
   "213": "213 Creation",
   "220": "Bible",
   "223": "Poetic books of Old Testament",
   "229": "Apocrypha & pseudepigrapha",
   "300": "Science"
};

var categoryIdList = Object.keys(categories).sort();
var moreCategoryIdList = Object.keys(moreCategories).sort();

test("find top-level categoriy Ids", ()=>{
   expect(util.getAllCategories("123.456", categoryIdList)).toEqual(["100"]);
   expect(util.getAllCategories("123.456", categoryIdList)).not.toEqual(["200"]);

   expect(util.getAllCategories("203.154", categoryIdList)).toEqual(["200"]);
   expect(util.getAllCategories("203.154", categoryIdList)).not.toEqual(["100"]);

   expect(util.getAllCategories("199.999", categoryIdList)).toEqual(["100"]);
   expect(util.getAllCategories("199.999", categoryIdList)).not.toEqual(["200"]);

   expect(util.getAllCategories("100", categoryIdList)).toEqual(["100"]);
   expect(util.getAllCategories("000.01", categoryIdList)).toEqual(["000"]);
   expect(util.getAllCategories("100.0001", categoryIdList)).toEqual(["100"]);

   expect(util.getAllCategories("100", categoryIdList)).not.toEqual(["300"]);
   expect(util.getAllCategories("100", categoryIdList)).not.toEqual(["200"]);
   expect(util.getAllCategories("100", categoryIdList)).not.toEqual(["101"]);

   expect(util.getAllCategories("301", categoryIdList)).toEqual(["300"]);
   expect(util.getAllCategories("399", categoryIdList)).toEqual(["300"]);
});

test("find three-level cateogry Ids", ()=>{
   expect(util.getAllCategories("100", moreCategoryIdList)).toEqual(["100"]);
   expect(util.getAllCategories("103", moreCategoryIdList)).toEqual(["100", "103"]);
   expect(util.getAllCategories("111", moreCategoryIdList)).toEqual(["100", "110", "111"]);
   expect(util.getAllCategories("123", moreCategoryIdList)).toEqual(["100", "120", "123"]);expect(util.getAllCategories("129", moreCategoryIdList)).toEqual(["100", "120", "129"]);
   
   expect(util.getAllCategories("200", moreCategoryIdList)).toEqual(["200"]);
   expect(util.getAllCategories("203", moreCategoryIdList)).toEqual(["200", "203"]);  
   expect(util.getAllCategories("211", moreCategoryIdList)).toEqual(["200", "210", "211"]);
   expect(util.getAllCategories("223", moreCategoryIdList)).toEqual(["200", "220", "223"]);
   expect(util.getAllCategories("229", moreCategoryIdList)).toEqual(["200", "220", "229"]);

   expect(util.getAllCategories("300", moreCategoryIdList)).toEqual(["300"]);
});

test("count fully-read pages with top-level dewey categories", ()=>{
   var total, detail;
   [total, detail] = util.getPageCounts(reads, categories);
   expect(total).toEqual(720);
   expect(detail).toEqual({"100": 410, "200": 310});
});

test("count partly-read pages with top-level dewey categories", ()=>{
   var total, detail;
   [total, detail] = util.getPageCounts(partialReads, categories);
   expect(total).toEqual(360);
   expect(detail).toEqual({"100": 205, "200": 155});
});

test("count unread pages with top-level dewey categories", ()=>{
   var total, detail;
   [total, detail] = util.getPageCounts(unreadReads, categories);
   expect(total).toEqual(0);
   expect(detail).toEqual({"100": 0, "200": 0});
});

test("count fully-read pages with deeper dewey categories", ()=>{
   var total, detail;
   [total, detail] = util.getPageCounts(reads, moreCategories);
   expect(total).toEqual(720);
   expect(detail).toEqual({
      "100": 410, "103": 100, "110": 100, "113": 100, "120": 110, "123": 110,
      "200": 310, "203": 100, "210": 100, "213": 100, "220": 110, "223": 110
   });
});

test("count partly-read pages with deeper dewey categories", ()=>{
   var total, detail;
   [total, detail] = util.getPageCounts(partialReads, moreCategories);
   expect(total).toEqual(360);
   expect(detail).toEqual({
      "100": 205, "103": 50, "110": 50, "113": 50, "120": 55, "123": 55,
      "200": 155, "203": 50, "210": 50, "213": 50, "220": 55, "223": 55
   });
});
