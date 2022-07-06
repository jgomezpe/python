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

Konekti.uses('split', 'ace', 'btn', 'terminal', 'finapunkto')

/** Konekti Plugin for Python */
class PythonPlugIn extends PlugIn{
    /** Creates a Plugin for Python */
    constructor(){ super('python') }
    
    /**
     * Creates a client for the plugin's instance
     * @param config Python configuration
     */
    client(config){ return new Python(config) }
}

if( Konekti.python===undefined) new PythonPlugIn()


const playIcon = "fa-play-circle-o" 
const stopIcon = "fa-stop-circle-o"

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
		super(config)
		this.url = config.url
		this.running = false
		this.captionRun = config.captionRun
		this.captionStop = config.captionStop
	}

	/**
	 * Function called when run button is pressed
	 */
	run(){
		var x = this
		var terminal = Konekti.client[x.id+'Console']
		var editor = Konekti.client[x.id+'Coder']
		var btn = Konekti.client[x.id+'Btn']
		if( x.running ){
			x.server.end()
			btn.update({"icon":playIcon,"caption":x.captionRun})
		}else{
			terminal.init()
			btn.update({"icon":stopIcon,"caption":x.captionStop})
			x.server = new ProcessRunner(x.url,"PythonServer",[editor.getText()])
			terminal.set(x.server)
			x.server.run( function(response){
				if( response !== undefined ) terminal.output(response)
				else{
					btn.update({"icon":playIcon,"caption":x.captionRun})
					x.running = false
				}
			})
		}
		x.running = !x.running 
	}

	editor(){ return Konekti.client[this.id+'Coder'] }
}

/**
 * Creates a Python server client configuration object
 * @param id GUI's id,
 * @param width Width of the terminal's component
 * @param height Height of the terminal's component
 * @param url Python's server url
 * @param type If python console will be displayed as a row ('row') or as a column ('col') 
 * @param theme Editor's theme 
 * @param captionRun Caption for the run button when ready for running python code (to start code running)
 * @param captionStop Caption for the run button when running python code (to stop code running)
 * @param parent Parent component 
 */
Konekti.pythonConfig = function(id, width, height, url, type, theme, captionRun, captionStop, parent='KonektiMain'){
	captionStop = captionStop || ''
	captionRun = captionRun || '' 
	var one = Konekti.aceConfig(id+'Coder', '100%', '100%', '', 'python', theme)
	var btn = Konekti.btnConfig(id+'Btn', playIcon, captionRun, {"client":id, "method":"run"}, 'w3-blue-grey', '', id+'Two')
	var term = Konekti.terminalConfig(id+'Console', '100%', 'rest', '', 1000000, id+'Two')
	var two = Konekti.divConfig(id+'Two', '100%', '100%', '', [btn,term], id+'Split')
	var split = Konekti.splitConfig(id+'Split','100%','100%', type, 60, one, two, id)
	return {'plugin':'python', 'id':id, 'width':width, 'height' :height, 'parent':parent, 'url':url, 'captionRun':captionRun, 'captionStop':captionStop, 'children':[split]}
}

/**
 * Creates a Python server client
 * @param id GUI's id,
 * @param width Width of the terminal's component
 * @param height Height of the terminal's component
 * @param url Python's server url
 * @param type If python console will be displayed as a row ('row') or as a column ('col') 
 * @param theme Editor's theme 
 * @param captionRun Caption for the run button when ready for running python code (to start code running)
 * @param captionStop Caption for the run button when running python code (to stop code running)
 */
 Konekti.python = function(id, width, height, url, type, theme, captionRun, captionStop){
	return Konekti.build(Konekti.pythonConfig(id, width, height, url, type, theme, captionRun, captionStop))
}