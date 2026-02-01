import React, { useState } from 'react'
const ActionConfirmModal = ({ open, action, onCancel, onConfirm }) => {
  const [note, setNote] = useState('')
  if (!open) return null
  return (
    <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl w-[95%] max-w-md p-5 space-y-4'>
        <h2 className='text-lg font-semibold text-center capitalize'>
          Confirm {action.replace('_', ' ')}
        </h2>
        <textarea
          placeholder='Add optional note'
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className='w-full border rounded p-2 text-sm resize-none h-24' />
        <div className='flex justify-center gap-5'>
          <button
            onClick={onCancel}
            className='px-3 text-white py-1 border rounded bg-red-500 hover:bg-red-400 transition'>
            Cancel
          </button>
          <button
            onClick={() => onConfirm(note)}
            className='px-3 text-white py-1 border rounded bg-green-500 hover:bg-green-400 transition'>
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
export default ActionConfirmModal