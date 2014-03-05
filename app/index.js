'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var fs = require('fs');


var SpGenerator = module.exports = function SpGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(SpGenerator, yeoman.generators.Base);

SpGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);

  var prompts = [{
    type: 'list',
    name: 'scriptType',
    message: 'Select using script language',
    choices:[
      { 'name':'Coffeescript', value:'coffee' },
      { 'name':'Javascript', value:'js' },
    ],
    default: 'js'
  },{
    type: 'list',
    name: 'templateType',
    message: 'Select using template engine',
    choices:[
      { 'name':'Jade', value:'jade' },
      { 'name':'Swig', value:'swig' },
    ],
    default: 'swig'
  },{
    name:'capprojectname',
    message:'Input project name for Capistrano',
    default:"sp-project"
  }];

  this.prompt(prompts, function (props) {
    this.scriptType = props.scriptType;
    this.templateType = props.templateType;
    this.capprojectname = props.capprojectname;
    cb();
  }.bind(this));
};

SpGenerator.prototype.app = function app() {
  var self = this;
  this.mkdir('app');
  this.mkdir('app/html');
  this.mkdir('app/scripts');
  this.mkdir('app/files');

  this.mkdir('config');

  this.directory('app/images','app/images');
  this.directory('app/styles','app/styles');
  this.directory('app/scripts/' + self.scriptType + '/','app/scripts');
  this.directory('app/html/' + self.templateType, "app/html" )

};
SpGenerator.prototype.cap = function cap(){
  console.log("Accept " + this.cap_project_name);
  var self = this;
  [
    'Capfile',
    'Gemfile',
    'Gemfile.lock',
  ].forEach(function(path){
    self.copy(path,path);
  });
  self.directory('config','config');
}
SpGenerator.prototype.projectfiles = function projectfiles() {
  var self = this;
  this.directory('tasks','tasks');
  fs.readdirSync(__dirname + '/templates/grunt/').forEach(function(item){
    var data = self.read('grunt/' + item );
    self.write('grunt/' + item, data);
  });

  (function(data){
    self.write('Gruntfile.coffee',data)
  })(self.read('Gruntfile.coffee'));

  [
    'README.md',
    'package.json',
    'bower.json',
  ].forEach(function(path){
    self.copy(path,path)
  });


  [
    'gruntconfig.coffee',
    'gitattributes',
    'gitignore',
    'bowerrc',
    'editorconfig',
    'jshintrc',
    'coffeelintrc'
  ].forEach(function(path){
    self.copy(path,'.' + path)
  });



};
