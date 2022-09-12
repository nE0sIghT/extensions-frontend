<template>
    <validation-provider v-slot="validationContext" :rules='rules' :name='label' :vid='inputVid'>
        <b-form-group :label="`${label}:`" label-cols-md="2">
            <b-input-group>
                <b-input-group-prepend v-if='icon'>
                    <b-input-group-text>
                        <b-icon :icon='icon' />
                    </b-input-group-text>
                </b-input-group-prepend>
                <b-form-input
                    :autocomplete="inputAutocomplete"
                    :label="label"
                    :placeholder="inputPlaceholder"
                    :required="required"
                    :state="getValidationState(validationContext)"
                    :type="type"
                    :value='value'
                    @input="$emit('input', $event)"
                ></b-form-input>
                <b-form-invalid-feedback>{{ validationContext.errors[0] }}</b-form-invalid-feedback>
            </b-input-group>
        </b-form-group>
    </validation-provider>
</template>

<script>
import { ValidationProvider } from 'vee-validate';

export default {
    props: {
        value: String,
        vid: String,
        autocomplete: String,
        icon: String,
        label: String,
        placeholder: String,
        required: Boolean,
        rules: String,
        type: String,
    },

    computed: {
        inputAutocomplete() {
            return this.autocomplete || `new-${this.label.toLowerCase().replaceAll(/\s+/g, "-")}`;
        },

        inputPlaceholder() {
            return this.placeholder || `Enter ${this.label.toLowerCase()}`;
        },

        inputVid() {
            return this.vid || this.label.toLowerCase().replaceAll(/\s+/g, '_');
        },
    },

    components: {
        ValidationProvider,
    }
};
</script>
