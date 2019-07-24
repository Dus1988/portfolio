
## Angular Components and Misc TS files

This folder is meant to be a collection of examples of TS components, directives, singleton services, ect., that I have developed. 

## Autogrow Directive
This directive was created as a way to allow a textarea input autogrow as necessary

## Card Component

Card component was a solution for a project that required custom bootstrap 3 Cards on screen to have injectable content. To this end, at the time I opted to utilize template injection techniques. This allowed for the card component to stay generic and only control its width and border color. Effectively, a parent component would inject a template into the component and retain scope, utilizing the card component as a helper.

## Emmitters Service
The project had a need for common subscriptions to be made, so that we did not need to keep running multiple instanes of host listeners.

##Enums 
These enums are utilized in card component

##Overlay Component
A component that took up the entire screen, utilizes the template injection techniques explained in the card component description.

## Example Usage Component
a simple component to illustrate the use of overlay and card components and their template injection methods.
