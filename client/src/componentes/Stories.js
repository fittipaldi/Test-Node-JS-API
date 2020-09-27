import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {ServerApi} from '../utils';
import Header from './nav/Header';

const Stories = (props) => {

    const {id} = useParams();

    const [state, setState] = useState({
        item: {},

        story_up: '',
        story_left: '',
        story_center: '',
        story_right: '',
        story_down: '',

        story_up_id: 0,
        story_left_id: 0,
        story_center_id: 0,
        story_right_id: 0,
        story_down_id: 0,

        edit_up: false,
        edit_left: false,
        edit_center: false,
        edit_right: false,
        edit_down: false,

        isLoading: false,
        message: ''
    });

    const {
        item,
        story_up,
        story_left,
        story_center,
        story_right,
        story_down,
        story_up_id,
        story_left_id,
        story_center_id,
        story_right_id,
        story_down_id,
        edit_up,
        edit_left,
        edit_center,
        edit_right,
        edit_down,
        isLoading,
        message
    } = state;

    const fillStartStates = async (resp) => {
        if (resp.data.data) {
            const tmpData = {
                story_up: '',
                story_left: '',
                story_right: '',
                story_down: '',
                story_up_id: 0,
                story_left_id: 0,
                story_right_id: 0,
                story_down_id: 0,
            };
            if (resp.data.data.children.length > 0) {
                for (let child of resp.data.data.children) {
                    switch (child.position.toUpperCase()) {
                        case 'U':
                            tmpData.story_up_id = child.id;
                            tmpData.story_up = child.text;
                            break;
                        case 'L':
                            tmpData.story_left_id = child.id;
                            tmpData.story_left = child.text;
                            break;
                        case 'R':
                            tmpData.story_right_id = child.id;
                            tmpData.story_right = child.text;
                            break;
                        case 'D':
                            tmpData.story_down_id = child.id;
                            tmpData.story_down = child.text;
                            break;
                    }
                }
            }
            await setState({
                ...state,
                isLoading: false,
                message: '',
                item: resp.data.data,
                story_center: resp.data.data.text,
                story_center_id: resp.data.data.id,
                story_up: tmpData.story_up,
                story_left: tmpData.story_left,
                story_right: tmpData.story_right,
                story_down: tmpData.story_down,
                story_up_id: tmpData.story_up_id,
                story_left_id: tmpData.story_left_id,
                story_right_id: tmpData.story_right_id,
                story_down_id: tmpData.story_down_id,
            });
        }
    };

    const handleLoadStarterStory = async () => {
        try {
            await setState({...state, isLoading: true, item: {}});
            ServerApi.getStarterStory().then(async (resp) => {
                if (resp.data.status) {
                    fillStartStates(resp);
                } else {
                    await setState({...state, isLoading: false, message: resp.msg, item: {}});
                    alert(resp.msg);
                }
            }).catch(async (err) => {
                const msg = (typeof err.message != 'undefined') ? err.message : err;
                await setState({...state, isLoading: false, message: msg, item: {}});
                alert(msg);
            });
        } catch (err) {
            const msg = (typeof err.message != 'undefined') ? err.message : err;
            await setState({...state, isLoading: false, message: msg, item: {}});
            alert(msg);
        }
    };

    const saveStory = async (item_id, text, parent_id, position) => {
        try {
            await setState({...state, isLoading: true});
            const params = {
                id: item_id,
                text: text,
                parent_id: parent_id,
                position: position,
            };

            ServerApi.setStory(params).then(async (resp) => {
                if (resp.data.status) {
                    if (resp.data.data.parent_id) {
                        let t_story_up = story_up;
                        let t_story_up_id = story_up_id;
                        let t_story_left = story_left;
                        let t_story_left_id = story_left_id;
                        let t_story_right = story_right;
                        let t_story_right_id = story_right_id;
                        let t_story_down = story_down;
                        let t_story_down_id = story_down_id;

                        switch (resp.data.data.position.toUpperCase()) {
                            case 'U':
                                t_story_up_id = resp.data.data.id;
                                t_story_up = resp.data.data.text;
                                break;
                            case 'L':
                                t_story_left_id = resp.data.data.id;
                                t_story_left = resp.data.data.text;
                                break;
                            case 'R':
                                t_story_right_id = resp.data.data.id;
                                t_story_right = resp.data.data.text;
                                break;
                            case 'D':
                                t_story_down_id = resp.data.data.id;
                                t_story_down = resp.data.data.text;
                                break;
                        }

                        await setState({
                            ...state,
                            isLoading: false,
                            message: resp.msg,
                            edit_up: false,
                            edit_left: false,
                            edit_center: false,
                            edit_right: false,
                            edit_down: false,
                            story_up: t_story_up,
                            story_up_id: t_story_up_id,
                            story_left: t_story_left,
                            story_left_id: t_story_left_id,
                            story_right: t_story_right,
                            story_right_id: t_story_right_id,
                            story_down: t_story_down,
                            story_down_id: t_story_down_id,
                        });
                    } else {
                        window.location.reload();
                    }
                } else {
                    await setState({...state, isLoading: false, message: resp.msg});
                    alert(resp.msg);
                }
            }).catch(async (err) => {
                const msg = (typeof err.message != 'undefined') ? err.message : err;
                await setState({...state, isLoading: false, message: msg});
                alert(msg);
            });
        } catch (err) {
            const msg = (typeof err.message != 'undefined') ? err.message : err;
            await setState({...state, isLoading: false, message: msg});
            alert(msg);
        }
    };

    const handleLoadStory = async (item_id) => {
        try {
            await setState({...state, isLoading: true, item: {}});
            ServerApi.getStory(item_id).then(async (resp) => {
                if (resp.data.status) {
                    fillStartStates(resp);
                } else {
                    await setState({...state, isLoading: false, message: resp.msg, item: {}});
                    alert(resp.msg);
                }
            }).catch(async (err) => {
                const msg = (typeof err.message != 'undefined') ? err.message : err;
                await setState({...state, isLoading: false, message: msg, item: {}});
                alert(msg);
            });
        } catch (err) {
            const msg = (typeof err.message != 'undefined') ? err.message : err;
            await setState({...state, isLoading: false, message: msg, item: {}});
            alert(msg);
        }
    };

    const handlerInputChange = (event) => {
        switch (event.target.name) {
            case 'story_up':
                setState({...state, story_up: event.target.value});
                break;
            case 'story_left':
                setState({...state, story_left: event.target.value});
                break;
            case 'story_center':
                setState({...state, story_center: event.target.value});
                break;
            case 'story_right':
                setState({...state, story_right: event.target.value});
                break;
            case 'story_down':
                setState({...state, story_down: event.target.value});
                break;
        }
    };

    const handlerButtonClick = (event) => {
        switch (event.target.name) {
            case 'save_up':
                saveStory(story_up_id, story_up, story_center_id, 'U');
                break;
            case 'save_left':
                saveStory(story_left_id, story_left, story_center_id, 'L');
                break;
            case 'save_center':
                saveStory(story_center_id, story_center, null, 'C');
                break;
            case 'save_right':
                saveStory(story_right_id, story_right, story_center_id, 'R');
                break;
            case 'save_down':
                saveStory(story_down_id, story_down, story_center_id, 'D');
                break;
        }
    };

    const editItem = (event) => {
        switch (event.target.name) {
            case 'edit_up':
                setState({...state, edit_up: true});
                break;
            case 'edit_left':
                setState({...state, edit_left: true});
                break;
            case 'edit_center':
                setState({...state, edit_center: true});
                break;
            case 'edit_right':
                setState({...state, edit_right: true});
                break;
            case 'edit_down':
                setState({...state, edit_down: true});
                break;
        }
    };

    const deleteItem = (id) => {
        if (window.confirm('Are you sure?')) {
            ServerApi.delStory(id).then(async (resp) => {
                if (resp.data.status) {
                    window.location.reload();
                } else {
                    alert(resp.msg);
                }
            }).catch(async (err) => {
                const msg = (typeof err.message != 'undefined') ? err.message : err;
                await setState({...state, isLoading: false, message: msg});
                alert(msg);
            });
        }
    };

    useEffect(() => {
        if (typeof id != 'undefined' && id) {
            handleLoadStory(id);
        } else {
            handleLoadStarterStory();
        }
    }, []);

    return (
        <div className="App">
            <Header clicked="list"/>

            {(story_center_id) ?
                <div className="list">
                    <div className="row">
                        <div className="story-center box">
                            {(story_up_id && story_up && !edit_up) ?
                                <div>
                                    <a className="story-link" href={'/story/' + story_up_id}>{story_up}</a>
                                    <button className="btn-del" onClick={() => {
                                        deleteItem(story_up_id);
                                    }}>Del
                                    </button>
                                    <button className="btn-edit" name="edit_up" onClick={editItem}>Edit</button>
                                </div>
                                :
                                <div>
                                    <input className="ipt" type="text" name="story_up" value={story_up}
                                           onChange={handlerInputChange}/>
                                    <button className="btn-save" name="save_up" onClick={handlerButtonClick}>Save
                                    </button>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="row">
                        <div className="story-left box">
                            {(story_left_id && story_left && !edit_left) ?
                                <div>
                                    <a className="story-link" href={'/story/' + story_left_id}>{story_left}</a>
                                    <button className="btn-del" onClick={() => {
                                        deleteItem(story_left_id);
                                    }}>Del
                                    </button>
                                    <button className="btn-edit" name="edit_left" onClick={editItem}>Edit</button>
                                </div>
                                :
                                <div>
                                    <input className="ipt" type="text" name="story_left" value={story_left}
                                           onChange={handlerInputChange}/>
                                    <button className="btn-save" name="save_left" onClick={handlerButtonClick}>Save
                                    </button>
                                </div>
                            }
                        </div>
                        <div className="story-center box">
                            {(!item.parent_id) ?
                                <div>
                                    <a className="story-link">{story_center}</a>
                                    <button className="btn-del" onClick={() => {
                                        deleteItem(story_center_id);
                                    }}>Del
                                    </button>
                                </div>
                                :
                                <a className="story-link" href={'/story/' + item.parent_id}>{story_center}</a>
                            }
                        </div>
                        <div className="story-right box">
                            {(story_right_id && story_right && !edit_right) ?
                                <div>
                                    <a className="story-link" href={'/story/' + story_right_id}>{story_right}</a>
                                    <button className="btn-del" onClick={() => {
                                        deleteItem(story_right_id);
                                    }}>Del
                                    </button>
                                    <button className="btn-edit" name="edit_right" onClick={editItem}>Edit</button>
                                </div>
                                :
                                <div>
                                    <input className="ipt" type="text" name="story_right" value={story_right}
                                           onChange={handlerInputChange}/>
                                    <button className="btn-save" name="save_right" onClick={handlerButtonClick}>Save
                                    </button>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="row">
                        <div className="story-center box">
                            {(story_down_id && story_down && !edit_down) ?
                                <div>
                                    <a className="story-link" href={'/story/' + story_down_id}>{story_down}</a>
                                    <button className="btn-del" onClick={() => {
                                        deleteItem(story_down_id);
                                    }}>Del
                                    </button>
                                    <button className="btn-edit" name="edit_down" onClick={editItem}>Edit</button>
                                </div>
                                :
                                <div>
                                    <input className="ipt" type="text" name="story_down" value={story_down}
                                           onChange={handlerInputChange}/>
                                    <button className="btn-save" name="save_down" onClick={handlerButtonClick}>Save
                                    </button>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                :
                <div>
                    <div>
                        <input className="ipt" type="text" name="story_center" value={story_center}
                               onChange={handlerInputChange}/>
                        <button className="btn-save" name="save_center" onClick={handlerButtonClick}>Save
                        </button>
                    </div>
                </div>
            }

        </div>
    )
};

export default Stories;