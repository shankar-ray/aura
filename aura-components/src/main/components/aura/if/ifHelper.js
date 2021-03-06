/*
 * Copyright (C) 2013 salesforce.com, inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
({
    createBody: function(cmp, isTrue) {
        var body  = [];
        var facet = isTrue ? cmp.get("v.template") : cmp.get("v.else");
        
        $A.pushCreationPath("body");
        
        for (var i = 0, length = facet.length; i < length; i++) {
            $A.setCreationPathIndex(i);
            var cdr = facet[i];

            if (!cdr.attributes.valueProvider) {
                cdr.attributes.valueProvider = cmp.getAttributeValueProvider();
            }

            body.push($A.componentService.createComponentFromConfig(cdr));
        }
        
        $A.popCreationPath("body");

        return body;
    },

    clearUnrenderedBody: function(cmp) {
        var hasUnrenderBody = false;        
        var currentBody = cmp.get('v.body');

        for (var i = 0 ; i < currentBody.length; i++) {
            var child = currentBody[i];
            if (!child.isRendered()) {
                hasUnrenderBody = true;
                child.destroy();
            }
        }
        
        if (hasUnrenderBody && $A.getContext().getMode() !== 'PROD') {
            var owner = cmp.getOwner();
            $A.warning([
                '[Performance degradation] ',
                'markup://aura:if ["' + cmp.getGlobalId() + '"] in ',
                owner.getName() + ' ["' + owner.getGlobalId() + '"] ',
                'needed to clear unrendered body.\n',
                'More info: https://developer.salesforce.com/docs/atlas.en-us.lightning.meta/lightning/perf_warnings_if.htm'
            ].join(''));
        }
    }
})// eslint-disable-line semi
