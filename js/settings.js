function Settings(){
    this.minimalMatchScore = 0.10; //the minimal match score a file needs to have in order to show up
    this.searchDepth = 25; //the amount of sub directories that should be searched
    this.loadFileCount = 13; //the amount of matches that should be loaded at a time
}
var settings = new Settings();