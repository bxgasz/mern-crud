import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const notesAdapter = createEntityAdapter({
    sortComparer: (a,b) => (a.completed === b.completed) ? 0 : a.completed ? 1 : -1
})

const initialState = notesAdapter.getInitialState()

export const notesApiSLice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getNotes: builder.query({
            query: () => ({
                url: '/notes',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                }
            }),
            transformResponse: responseData => {
                const loadedNotes = responseData.map(user => {
                    user.id = user._id
                    return user
                })
                return notesAdapter.setAll(initialState, loadedNotes)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Note', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Note', id }))
                    ]
                } else return [{type: 'Note', id:'List'}]
            }
        }),
        addNewNote: builder.mutation({
            query: initialNote => ({
                url: '/notes',
                method: 'POST',
                body: {
                    ...initialNote,
                }
            }),
            invalidatesTags: [
                { type: 'Note', id: "LIST" }
            ]
        }),
        updateNote: builder.mutation({
            query: initialNote => ({
                url: '/notes',
                method: 'PATCH',
                body: {
                    ...initialNote
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Note', id: arg.id }
            ]
        }),
        deleteNote: builder.mutation({
            query: ({ id }) => ({
                url: '/notes',
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Note', id: arg.id }
            ]
        })
    })
})

export const {
    useGetNotesQuery,
    useAddNewNoteMutation,
    useUpdateNoteMutation,
    useDeleteNoteMutation
} = notesApiSLice

export const selectNotesResult = notesApiSLice.endpoints.getNotes.select()

const selectNotesData = createSelector(selectNotesResult, notesResult => notesResult.data)

export const {
    selectAll: selectAllNotes,
    selectById: selectNotesById,
    selectIds: selectNotesIds,
} = notesAdapter.getSelectors(state => selectNotesData(state) ?? initialState)