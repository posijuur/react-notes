var Note = React.createClass({
    render: function() {
        var style = { backgroundColor: this.props.color };
        return (
            <div className="note" style={style}>
                <span className="delete-note" onClick={this.props.onDelete}> × </span>
                {this.props.children}
            </div>
        );
    }
});

var NoteColor = React.createClass({

    render: function() {
        var style = { backgroundColor: this.props.color, width: "50px", height: "50px", display: "inline-block", borderRadius: "50%", marginRight: "10px"};
        return (
            <div style={style}  onClick={this.props.onColorChange}/>
        );
    }

});

var NoteEditor = React.createClass({
    getInitialState: function() {
        return {
            text: '',
            changeColor: [
                {
                    id:1,
                    color: "red"
                },
                {
                    id:2,
                    color: "black"
                },
                {
                    id:3,
                    color: "green"
                },
                {
                    id:4,
                    color: "yellow"
                },
                {
                    id:5,
                    color: "blue"
                },
            ]
        };
    },

    handleColorChange: function (event) {
        var style = getComputedStyle(event.target);
        console.log(style.backgroundColor);
        this.color = style.backgroundColor;
    },

    handleTextChange: function(event) {
        this.setState({ text: event.target.value });
    },

    handleNoteAdd: function() {
        var newNote = {
            text: this.state.text,
            color: this.color,
            id: Date.now()
        };

        this.props.onNoteAdd(newNote);
        this.setState({ text: '' });
    },

    render: function() {
        var foo = this.handleColorChange;
        return (
            <div className="note-editor">
                <textarea
                    placeholder="Enter your note here..."
                    rows={5}
                    className="textarea"
                    value={this.state.text}
                    onChange={this.handleTextChange}
                />
                <div className="note-editor_color">
                    {
                        this.state.changeColor.map(function(color) {
                            return <NoteColor 
                                        key = {color.id}
                                        color = {color.color}
                                        onColorChange = {foo}
                                        />

                        })
                    }
                </div>
                <button className="add-button" onClick={this.handleNoteAdd}>Add</button>
            </div>
        );
    }
});

var NotesGrid = React.createClass({
    componentDidMount: function() {
        var grid = this.refs.grid;
        this.msnry = new Masonry( grid, {
            itemSelector: '.note',
            columnWidth: 200,
            gutter: 10,
            isFitWidth: true
        });
    },

    componentDidUpdate: function(prevProps) {
        if (this.props.notes.length !== prevProps.notes.length) {
            this.msnry.reloadItems();
            this.msnry.layout();
        }
    },

    render: function() {
        var onNoteDelete = this.props.onNoteDelete;

        return (
            <div className="notes-grid" ref="grid">
                {
                    this.props.notes.map(function(note){
                        return (
                            <Note
                                key={note.id}
                                onDelete={onNoteDelete.bind(null, note)}
                                color={note.color}>
                                {note.text}
                            </Note>
                        );
                    })
                }
            </div>
        );
    }
});

var NoteSearch = React.createClass({

    render: function() {
        var rr = this.props.onNoteChange;
        var tt = this.props.onNoteClick;
        return (
            <div> 
            <button onClick={tt}>Seach</button>
            <input 
                type="text" 
                name="" 
                value={this.props.state} 
                placeholder="Seach..."
                onChange={rr}
            />
            </div>
        );
    }

});

var NotesApp = React.createClass({
    getInitialState: function() {
        return {
            notes     : [],
            searchText: ''
        };
    },

    componentDidMount: function() {
        var localNotes = JSON.parse(localStorage.getItem('notes'));
        if (localNotes) {
            this.setState({ notes: localNotes });
        }
    },

    componentDidUpdate: function() {
        this._updateLocalStorage();
    },

    handleNoteDelete: function(note) {
        var noteId = note.id;
        var newNotes = this.state.notes.filter(function(note) {
            return note.id !== noteId;
        });
        this.setState({ notes: newNotes });
    },

    handleNoteAdd: function(newNote) {
        var newNotes = this.state.notes.slice();
        newNotes.unshift(newNote);
        this.setState({ notes: newNotes });
    },

    handleNoteSearch: function (event) {
         console.log(event.target.value);
        this.setState({
            searchText: event.target.value
        });
    },

    handleNoteSeachOnClick: function () {
        var arr = this.state.notes.filter(function(el) {
            return el.indexOf(this.state.searchText) !== 1;
        });

        this.setState({
            notes: arr
        });
    },

    render: function() {
        return (
            <div className="notes-app">
                <h2 className="app-header">NotesApp</h2>
                <NoteEditor onNoteAdd={this.handleNoteAdd} />
                <NotesGrid notes={this.state.notes} onNoteDelete={this.handleNoteDelete} />
            </div>
        );
    },

    _updateLocalStorage: function() {
        var notes = JSON.stringify(this.state.notes);
        localStorage.setItem('notes', notes);
    }
});

ReactDOM.render(
    <NotesApp />,
    document.getElementById('mount-point')
);