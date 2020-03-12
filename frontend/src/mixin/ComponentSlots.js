export default {
    methods: {
        hasSlot(name = 'default') {
            return !!this.$slots[name] || !!this.$scopedSlots[name];
        }
    }
}
