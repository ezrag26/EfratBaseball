import React from 'react'

const Button = ({ className = '', type, formId, onClick = () => {}, display, disabled = false }) => {
	return <button className={`button ${className} ${disabled ? 'disabled' : ''}`} type={type} form={formId} onClick={onClick} disabled={disabled}>{display}</button>
}

const ContainedButton = ({ onClick, display, disabled }) => {
	return <Button onClick={onClick} display={display} disabled={disabled}/>
}

const SecondaryContainedButton = ({ onClick, display, disabled }) => {
	return <Button className={'contained'} onClick={onClick} display={display} disabled={disabled}/>
}

const OutlineButton = ({ onClick, display, disabled }) => {
	return <Button className={'outline'} onClick={onClick} display={display} disabled={disabled}/>
}

const TextButton = ({ onClick, display, disabled }) => {
	return <Button className={'text'} onClick={onClick} display={display} disabled={disabled}/>
}

const SubmitButton = ({ onClick, formId, display, disabled }) => {
	return <Button type={'submit'} onClick={onClick} formId={formId} display={display} disabled={disabled}/>
}

const FloatingActionButton = ({ onClick, display, disabled }) => {
	return <Button className={'fab'} onClick={onClick} display={display} disabled={disabled}/>
}

const ActionButton = ({ display, onClick, disabled }) => {
	return (
		<Button className={'tiny small-padding'} display={display} onClick={onClick} disabled={disabled} />
	)
}

export { ContainedButton, SecondaryContainedButton, OutlineButton, TextButton, SubmitButton, FloatingActionButton, ActionButton }
