/**
*
* python.js
* <P>A client for a Python server (See <A HREF="https://github.com/jgomezpe/aplikigo">aplikigo</A> package) </P>
* <P>Requires Konekti.js, and finapunkto.js </P>
* <P>A numtseng module <A HREF="https://numtseng.com/modules/python.js">https://numtseng.com/modules/python.js</A> 
* Copyright (c) 2021 by Jonatan Gomez-Perdomo. <br>
* All rights reserved. See <A HREF="https://github.com/jgomezpe/python">License</A>. <br>
*
* @author <A HREF="https://disi.unal.edu.co/~jgomezpe/"> Professor Jonatan Gomez-Perdomo </A>
* (E-mail: <A HREF="mailto:jgomezpe@unal.edu.co">jgomezpe@unal.edu.co</A> )
* @version 1.0
*/

/*
 *
 * A client for a Python server
 */  
class Python extends Client{
	/**
	 * Creates a Python server client
	 * @param id GUI id
	 * @param url Python server url
	 * @param type If Python console will be displayed as a row ('row') or as a column ('col') 
	 * @param captionRun Caption for the run button when ready for running python code (to start code running)
	 * @param captionStop Caption for the run button when running python code (to stop code running)
	 */
	constructor(id, url, type="col", captionRun='', captionStop=''){
		super(id+"Python")
		this.captionRun = captionRun
		this.captionStop = captionStop
		this.url = url
		this.running = false
		Konekti.split( 
		  { "id":id, "type":type,
		  "start":60,
		  "one":{
		  	"plugin":"hcf", 
		  	"content":{ "plugin":"ace","id":"coder","mode":"python","initial":"x=int(input('?'))\nprint(x+3)\n" },
		  	"header":{"plugin":"btn","id":"run", "icon":"fa fa-play","caption":captionRun,
		  	  "options":"w3-bar-item w3-medium","onclick":{"client":id+"Python"}}
		  },
		  "two":{"plugin":"terminal","id":"viewer","initial":""}
		}
		)
	}

	/**
	 * Function called when run button is pressed
	 * @param btnId Run button id
	 */
	run( btnId ){
		var x = this
		var terminal = Konekti.client('viewer')
		var editor = Konekti.client('coder')
		var btn = Konekti.client('run')
		if( x.running ){
			x.server.end()
			btn.update({"icon":"fa fa-play","caption":x.captionRun})
		}else{
			terminal.init()
			btn.update({"icon":"fa fa-stop","caption":x.captionStop})
			x.server = new ProcessRunner(x.url,"PythonServer",[editor.getText()])
			terminal.set(this.server)
			x.server.run( function(response){
				if( response !== undefined ) terminal.output(response)
				else{
					btn.update({"icon":"fa fa-play","caption":x.captionRun})
					x.running = false
				}
			})
		}
		x.running = !x.running 
	}
}

