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
	 * @param config Configuration includes
	 * id: GUI's id,
	 * editor: Editor's id
	 * url: Python's server url
	 * run: Run button's id 
	 * console: Console/Terminal's id
	 * type If python console will be displayed as a row ('row') or as a column ('col') 
	 * captionRun Caption for the run button when ready for running python code (to start code running)
	 * captionStop Caption for the run button when running python code (to stop code running)
	 */
	constructor(config){
		super(config.id+"Python")
		this.url = config.url
		this.running = false
		this.captionRun = config.captionRun || ''
		this.captionStop = config.captionStop || ''
		this.editorID = config.editor || 'coderPy'
		this.consoleID = config.console || 'viewerPy'
		var type = config.type || 'col'
		var maxCharsConsole = config.maximum || 1000000
		var initial = config.initial || ''
		
		var aceCfg = { "plugin":"ace","id":this.editorID,"mode":"python","initial":initial }
		var split = { "id":config.id, "type":type,
		  "start":60,
		  "two":{"plugin":"terminal","id":this.consoleID,"initial":"","maximum":maxCharsConsole}
		}
		
		this.btnID = config.run || 'runPy'
		var btnCfg = {"plugin":"btn","id":this.btnID, "icon":"fa fa-play","caption":this.captionRun,
		  	  "options":"w3-bar-item w3-medium","onclick":{"client":this.id, "method":"run"}}
		var btn = Konekti.client( this.btnID )
		if( btn === undefined || btn === null )
		 split.one =  { "plugin":"hcf", "content": aceCfg, "header":btnCfg}
		else{
			btn.update(btnCfg)
			split.one = aceCfg
		}
		Konekti.split( split )
	}

	/**
	 * Function called when run button is pressed
	 */
	run(){
		var x = this
		var terminal = Konekti.client(x.consoleID)
		var editor = Konekti.client(x.editorID)
		var btn = Konekti.client(x.btnID)
		if( x.running ){
			x.server.end()
			btn.update({"icon":"fa fa-play","caption":x.captionRun})
		}else{
			terminal.init()
			btn.update({"icon":"fa fa-stop","caption":x.captionStop})
			x.server = new ProcessRunner(x.url,"PythonServer",[editor.getText()])
			terminal.set(x.server)
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

