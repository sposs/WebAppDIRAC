{% import pprint %}
<html>
  <head>
    <title>{% block title %}Default title{% end %}</title>
    <script src='//ajax.aspnetcdn.com/ajax/jQuery/jquery-1.8.2.min.js'></script>
    <script>
			$(document).ready(function(){
				var a = {'a':[1,2,3]};
				$.ajax({ 
					url: '/DIRAC/UP/saveAppState',
					data: {
            obj: 'App',
						app : 'potato',
						name: 'asda',
						state: JSON.stringify( { 'a': [1,2,3] } )
					},
				}).done(function(){
					var datadiv = $('#data');
					datadiv.append( "initial<br/" );
					$.ajax({
						url: '/DIRAC/UP/listAppState',
						data: { obj: 'App', app: 'potato' }
					}).done(function( data ){
						datadiv.append( " | " +JSON.stringify( data ) );
						$.ajax({
							url: '/DIRAC/UP/loadAppState',
							data: { obj: 'App', app: 'potato', name: 'asda' }
						}).done(function( data ){
							datadiv.append( " | " +JSON.stringify( data ) );
   						$.ajax({
	   						url: '/DIRAC/UP/delAppState',
		  					data: { obj: 'App', app: 'potato', name: 'asda' }
			  			}).done(function( data ){
								datadiv.append( " | deleted" );
							});
						});
					});
				});
			});
    </script>
  </head>
  <body>
   <h1> Placeholder for DIRAC </h1>
   <div id='sdat'>
     <pre>
{{ escape( pprint.pformat( data ) ) }}
     </pre>
   </div>
   <div id='data'></div>
  </body>
</html>