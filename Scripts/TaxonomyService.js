function TaxonomyService(termStoreName){
	
	this.termStoreName = termStoreName;
	
	// common error handler
	var onError = function(sender,args){
		console.log(args.get_message());
		console.log(args.get_stackTrace());
	};
	
	// dry: see multiple references below
	var getTermGroup = function(ctx, termGroupId){
		var termStore = SP.Taxonomy.TaxonomySession.getTaxonomySession(ctx).get_termStores().getByName(termStoreName);	    
	    return termStore.getGroup(termGroupId);
	};
	
	// add a new term to a given termset
	this.addNewTerm =  function(termGroupId, termSetName, displayLabel, onTermCreated){
		var context = SP.ClientContext.get_current();
		var termGroup = getTermGroup(context,termGroupId);
		var termSet = termGroup.get_termSets().getByName(termSetName);
		var term = termSet.createTerm(displayLabel, 1033, SP.Guid.newGuid());
		context.load(term);
		context.executeQueryAsync(function(){
			onTermCreated && onTermCreated();
		},onError);
		
	};
	
	// add a new termset to a given termGroup
	this.addNewTermSet = function(displayName, onTermSetCreated){
		var context = SP.ClientContext.get_current();
	    var termGroup = getTermGroup(context,"c8e6e8c8-8b05-4388-a9e7-aa757832101a");
		var termSet = termGroup.createTermSet(displayName, 1033, SP.Guid.newGuid());
		context.load(termSet);
		context.executeQueryAsync(function(){
				onTermSetCreated && onTermSetCreated();
		},onError);
	};
	
	// load all terms from a given termset
	this.getAllTermsByTermSet = function(termGroupId, termSetName, onTermsReceived){
	    var context = SP.ClientContext.get_current();
		var termGroup = getTermGroup(context, termGroupId);
		var termSet = termGroup.get_termSets().getByName(termSetName);
		var termCollection = termSet.getAllTerms();
		context.load(termCollection);
		context.executeQueryAsync(function(){
			var enumerator = termCollection.getEnumerator();
			var detachedTerms = [];
			while(enumerator.moveNext()){
				detachedTerms.push(enumerator.get_current().get_name());
			}
			onTermsReceived && onTermsReceived(detachedTerms);
		},onError);
	};
}