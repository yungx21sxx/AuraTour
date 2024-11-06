<template>
	<div class="editor">
		<h4 class="mb-4" v-if="title !== ''">{{title}}</h4>
		<editor-content class="editor__body" :editor="editor" />
	</div>
</template>

<script>
import StarterKit from '@tiptap/starter-kit'
import { Editor, EditorContent } from '@tiptap/vue-3'

export default {
	components: {
		EditorContent,
	},
	
	props: {
		modelValue: {
			type: String,
			default: '',
		},
		title: {
			type: String,
			required: false,
			default: ''
		}
	},
	
	emits: ['update:modelValue'],
	
	data() {
		return {
			editor: null,
		}
	},
	
	watch: {
		modelValue(value) {
			// HTML
			const isSame = this.editor.getHTML() === value
			
			// JSON
			// const isSame = JSON.stringify(this.editor.getJSON()) === JSON.stringify(value)
			
			if (isSame) {
				return
			}
			
			this.editor.commands.setContent(value, false)
		},
	},
	
	mounted() {
		this.editor = new Editor({
			extensions: [
				StarterKit,
			],
			content: this.modelValue,
			onUpdate: () => {
				// HTML
				this.$emit('update:modelValue', this.editor.getHTML())
				
				// JSON
				// this.$emit('update:modelValue', this.editor.getJSON())
			},
		})
	},
	
	beforeUnmount() {
		this.editor.destroy()
	},
}
</script>


<style scoped lang="scss">
	.editor {
		padding: 16px;
		border: 1px solid $light-gray;
		border-radius: 10px;
		min-height: 300px;
		margin-bottom: 16px;
		
		&__body {
			min-height: 300px;
		}
	}
</style>