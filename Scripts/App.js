function App(taxonomyServiceIdentifier, termGroupId, termSetName){
	
	this.taxonomyServiceIdentifier = taxonomyServiceIdentifier;
	this.termGroupId = termGroupId;
	this.termSetName = termSetName;
	this.taxonomyService = null;
	
	this.ensureTaxonomyService = function(){
		if(this.taxonomyService === null){
			this.taxonomyService = new TaxonomyService(taxonomyServiceIdentifier);
		}
	};
	
	this.init = function(onTermsLoaded){
		var that = this;
		$(document).ready(function(){
			// load required JavaScript files from the targeting tenant   
			var scriptbase = _spPageContextInfo.siteAbsoluteUrl + "/_layouts/15/";
			$.getScript(scriptbase + "SP.Runtime.js", function () {
				$.getScript(scriptbase + "SP.js", function(){
					$.getScript(scriptbase + "SP.Taxonomy.js", function(){
						// if all files are loaded, all terms are requested and printed to the website
						that.ensureTaxonomyService(); 
						that.taxonomyService.getAllTermsByTermSet(termGroupId, termSetName, onTermsLoaded);
					});
				});
			});
		
			$("#createNewTermSet").click(function(event){
				event.preventDefault();
			});
	
			$("#createNewTerm").click(function(event){
				var termLabel = $("#newTermName");
				that.ensureTaxonomyService();
				// if the new term is persisted, all terms have to be loaded again.
				that.taxonomyService.addNewTerm(termGroupId, termSetName, termLabel.val(), function(){
					termLabel.val("");
					that.taxonomyService.getAllTermsByTermSet(termGroupId, termSetName, onTermsLoaded);	
				});
				event.preventDefault();
			});	
		});
	};
}
